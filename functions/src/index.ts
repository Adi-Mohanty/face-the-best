import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { requireAdmin } from "./auth/requireAdmin";
import fetch from "node-fetch";
import { onDocumentCreated } from "firebase-functions/firestore";

admin.initializeApp();

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
const BATCH_SIZE = 3;
const MAX_CONCURRENCY = 2;
const MAX_RETRIES = 3;

async function callGemini(prompt: string, apiKey: string) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  const rawText = await response.text();

  // 👇 IMPORTANT: log raw response once
  console.log("GEMINI RAW TEXT:", rawText);

  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch {
    throw new Error("Gemini returned non-JSON response");
  }

  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("Gemini JSON:", JSON.stringify(json, null, 2));
    throw new Error("Gemini returned no usable content");
  }

  return {
    text,
    finishReason: json?.candidates?.[0]?.finishReason
  };
}


function buildGenerationPrompt(
    exam: string,
    subject: string,
    type: string,
    count: number,
    difficulty: string
  ) {
    const base = `
  Generate ${count} ${type} questions for ${exam} exam.
  Subject: ${subject}
  Difficulty: ${difficulty || "Medium"}
  
  Rules:
- Return valid JSON only
- Do not include markdown
- Keep explanations under 3 lines
- Avoid unnecessary wording
- Prefer concise options
  `;
  
    if (type === "MCQ") {
      return `${base}
  Schema:
  [
    {
      "type": "MCQ",
      "question": "",
      "options": ["", "", "", ""],
      "correctOption": 0,
      "explanation": "",
      "difficulty": "${difficulty}",
      "subject": "${subject}"
    }
  ]
  `;
    }
  
    if (type === "STATEMENT") {
      return `${base}
  Schema:
  [
    {
      "type": "STATEMENT",
      "question": "",
      "statements": ["", "", ""],
      "options": ["", "", "", ""],
      "correctOption": 0,
      "explanation": "",
      "difficulty": "${difficulty}",
      "subject": "${subject}"
    }
  ]
  `;
    }
  
    if (type === "ASSERTION_REASON") {
      return `${base}
  Schema:
  [
    {
      "type": "ASSERTION_REASON",
      "assertion": "",
      "reason": "",
      "options": ["", "", "", ""],
      "correctOption": 0,
      "explanation": "",
      "difficulty": "${difficulty}",
      "subject": "${subject}"
    }
  ]
  `;
    }
  
    if (type === "PASSAGE") {
      return `${base}
  Schema:
  [
    {
      "type": "PASSAGE",
      "passage": "",
      "question": "",
      "options": ["", "", "", ""],
      "correctOption": 0,
      "explanation": "",
      "difficulty": "${difficulty}",
      "subject": "${subject}"
    }
  ]
  `;
    }
  
    throw new Error("Unsupported question type");
}
  

function verificationPrompt(q: any) {
    let questionText = "";
  
    if (q.type === "MCQ" || q.type === "STATEMENT" || q.type === "PASSAGE") {
      questionText = q.question;
    }
  
    if (q.type === "ASSERTION_REASON") {
      questionText = `Assertion: ${q.assertion}\nReason: ${q.reason}`;
    }
  
    if (q.type === "STATEMENT") {
      questionText +=
        "\nStatements:\n" +
        q.statements.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n");
    }
  
    if (q.type === "PASSAGE") {
      questionText =
        `Passage:\n${q.passage}\n\nQuestion:\n${q.question}`;
    }
  
    return `
  Answer the following question correctly.
  
  ${questionText}
  
  Options:
  0. ${q.options[0]}
  1. ${q.options[1]}
  2. ${q.options[2]}
  3. ${q.options[3]}
  
  Return ONLY the correct option index (0-3).
  `;
}  


export const generateQuestions = onCall(
    { secrets: [GEMINI_API_KEY] },
    async (request) => {
      console.log("AUTH:", request.auth?.uid);
      requireAdmin(request);
  
      const { exam, subject, type, count, difficulty } = request.data;
  
      if (!exam || !subject || !type || !count) {
        throw new HttpsError(
          "invalid-argument",
          "Missing parameters"
        );
      }

      const geminiKey = process.env.GEMINI_API_KEY;

      if (!geminiKey) {
        throw new HttpsError(
          "internal",
          "GEMINI_API_KEY is missing in environment"
        );
      }

      console.log("SECRET PRESENT:", true);

      const db = admin.firestore();
  
      // 1️⃣ Generate questions
      const { text, finishReason } = await callGemini(
        buildGenerationPrompt(
          exam,
          subject,
          type,
          count,
          difficulty || "Medium"
        ),
        geminiKey
      );      
  
      // Parse generated questions
        let generatedQuestions: any[];

        try {
        generatedQuestions = JSON.parse(text);
        } catch {
        throw new HttpsError(
            "internal",
            "Gemini returned invalid JSON"
        );
        }

        if (!Array.isArray(generatedQuestions)) {
        throw new HttpsError(
            "internal",
            "Gemini response is not an array"
        );
        }

        const approved: any[] = [];
        const rejected: any[] = [];

        // 2️⃣ Verify each question
        for (const q of generatedQuestions) {
          try {
            // Optional schema sanity check
            if (!q || q.type !== type || !Array.isArray(q.options)) {
            rejected.push(q);
            continue;
            }

            const { text: verifyText } = await callGemini(
              verificationPrompt(q),
              geminiKey
            );
            
            const match = verifyText.match(/\b[0-3]\b/);
            
            if (!match) {
            rejected.push(q);
            continue;
            }

            const verifiedAnswer = parseInt(match[0], 10);

            if (verifiedAnswer === q.correctOption) {
            approved.push(q);
            } else {
            rejected.push(q);
            }
          } catch {
            rejected.push(q);
          }
        }

      // 3️⃣ Store approved questions
      for (const question of approved) {
        await db.collection("questions").add({
          exam,
          subject,
          ...question,
          isActive: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
  
      // 4️⃣ Return summary
      return {
        requested: count,
        generated: generatedQuestions.length,
        approved: approved.length,
        rejected: rejected.length
      };
    }
);


export const createGenerationJob = onCall(
  { secrets: [GEMINI_API_KEY] },
  async (request) => {
    requireAdmin(request);

    const { exam, subject, type, count, difficulty } = request.data;

    if (!exam || !subject || !type || !count) {
      throw new HttpsError("invalid-argument", "Missing parameters");
    }

    const totalBatches = Math.ceil(count / BATCH_SIZE);

    const jobRef = await admin.firestore()
      .collection("generationJobs")
      .add({
        exam,
        subject,
        type,
        difficulty,
        totalQuestions: count,

        batchesTotal: totalBatches,
        batchesCompleted: 0,

        generated: 0,
        approved: 0,
        rejected: 0,

        status: "RUNNING",
        createdBy: request.auth.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    return { jobId: jobRef.id };
  }
);


export const processGenerationJob = onDocumentCreated(
  {
    document: "generationJobs/{jobId}",
    secrets: [GEMINI_API_KEY],
    region: "us-central1"
  },
  async (event) => {
    if (!event.data) return;

    const jobRef = event.data.ref;
    const job = event.data.data();

    if (!job || job.status !== "RUNNING") return;

    const {
      exam,
      subject,
      type,
      difficulty,
      batchesTotal,
      totalQuestions
    } = job;

    const geminiKey = process.env.GEMINI_API_KEY!;
    const db = admin.firestore();

    let remaining = totalQuestions;
    let effectiveBatchSize = BATCH_SIZE;

    // Shared batch counter (acts like a queue index)
    let batchIndex = 0;

    async function runWorker() {
      while (true) {
        // Atomically claim a batch index
        const currentBatch = batchIndex++;
        if (currentBatch >= batchesTotal) return;
        if (remaining <= 0) return;

        const batchSize = Math.min(effectiveBatchSize, remaining);
        if (batchSize <= 0) return;

        let retries = 0;

        let generatedDelta = 0;
        let approvedDelta = 0;
        let rejectedDelta = 0;

        try {
          const { text, finishReason } = await callGemini(
            buildGenerationPrompt(
              exam,
              subject,
              type,
              batchSize,
              difficulty
            ),
            geminiKey
          );

          // Handle token truncation
          if (finishReason === "MAX_TOKENS") {
            retries++;

            if (retries === 2 && difficulty === "Hard" && !job.difficultyDowngraded) {
              await jobRef.update({ difficultyDowngraded: true });
            }

            if (retries >= MAX_RETRIES) {
              // Skip batch but count it
              rejectedDelta += batchSize;
              remaining -= batchSize;

              await jobRef.update({
                rejected: admin.firestore.FieldValue.increment(rejectedDelta),
                batchesCompleted: admin.firestore.FieldValue.increment(1)
              });

              continue;
            }

            effectiveBatchSize = Math.max(1, effectiveBatchSize - 1);
            continue;
          }

          // Parse Gemini output safely
          let questions: any[];
          try {
            questions = JSON.parse(text);
          } catch {
            rejectedDelta += batchSize;
            remaining -= batchSize;

            await jobRef.update({
              rejected: admin.firestore.FieldValue.increment(rejectedDelta),
              batchesCompleted: admin.firestore.FieldValue.increment(1)
            });

            continue;
          }

          const usableQuestions = questions.slice(0, batchSize);
          generatedDelta = usableQuestions.length;
          remaining -= generatedDelta;

          for (const q of usableQuestions) {
            try {
              const { text: verifyText } = await callGemini(
                verificationPrompt(q),
                geminiKey
              );

              const match = verifyText.match(/\b[0-3]\b/);
              if (!match || Number(match[0]) !== q.correctOption) {
                rejectedDelta++;
                continue;
              }

              approvedDelta++;

              await db.collection("questions").add({
                jobId: event.params.jobId,
                exam,
                subject,
                ...q,
                isActive: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
              });
            } catch {
              rejectedDelta++;
            }
          }

          // Commit batch results
          await jobRef.update({
            generated: admin.firestore.FieldValue.increment(generatedDelta),
            approved: admin.firestore.FieldValue.increment(approvedDelta),
            rejected: admin.firestore.FieldValue.increment(rejectedDelta),
            batchesCompleted: admin.firestore.FieldValue.increment(1)
          });

        } catch (err) {
          console.error("Batch failed:", err);
        }
      }
    }

    // Run workers in parallel
    await Promise.all(
      Array.from({ length: MAX_CONCURRENCY }).map(() => runWorker())
    );

    // Finalize job
    const latest = await jobRef.get();
    if (latest.data()?.status === "RUNNING") {
      await jobRef.update({
        status: remaining <= 0 ? "COMPLETED" : "PARTIAL",
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }
);


/**
 * TEMP sanity check function
 */
export const ping = onCall(() => {
  return { ok: true };
});

// export const adminHello = onCall((request) => {
//     // requireAdmin(request);
//     return { message: "Admin access confirmed" };
// });