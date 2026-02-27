import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { requireAdmin } from "./auth/requireAdmin";
import fetch from "node-fetch";
import { onDocumentCreated, onDocumentWritten } from "firebase-functions/firestore";

admin.initializeApp();

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
const BATCH_SIZE = 3;
const MAX_CONCURRENCY = 1;
const MAX_RETRIES = 3;


async function callGemini(
  prompt: string,
  apiKey: string,
  model: string,
  temperature: number = 0.7
) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  const rawText = await response.text();

  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch {
    console.error("Gemini RAW:", rawText);
    throw new Error("Gemini returned non-JSON response");
  }

  // 🔴 Handle API-level errors properly
  if (json.error) {
    console.error("Gemini API error:", json.error);
    throw new Error(json.error.message || "Gemini API error");
  }

  const candidate = json?.candidates?.[0];

  if (!candidate) {
    console.error("Gemini empty candidates:", json);
    throw new Error("Gemini returned no candidates");
  }

  if (candidate.finishReason === "SAFETY") {
    console.error("Gemini blocked by safety:", json);
    throw new Error("Blocked by safety");
  }

  const text = candidate?.content?.parts?.[0]?.text;

  if (!text || text.trim().length === 0) {
    console.error("Gemini empty text:", json);
    throw new Error("Gemini returned empty text");
  }

  return {
    text,
    finishReason: candidate.finishReason
  };
}



function explanationConsistencyPrompt(q: any, answer: number) {
  let questionBlock = "";

  if (q.type === "ASSERTION_REASON") {
    questionBlock = `
Assertion:
${q.assertion}

Reason:
${q.reason}
`;
  }

  else if (q.type === "PASSAGE") {
    questionBlock = `
Passage:
${q.passage}

Question:
${q.question}
`;
  }

  else if (q.type === "STATEMENT") {
    questionBlock = `
${q.question}

Statements:
${q.statements
      ?.map((s: string, i: number) => `${i + 1}. ${s}`)
      .join("\n")}
`;
  }

  else { // MCQ
    questionBlock = q.question;
  }

  return `
Evaluate logical consistency of the following:

${questionBlock}

Options:
0. ${q.options?.[0]}
1. ${q.options?.[1]}
2. ${q.options?.[2]}
3. ${q.options?.[3]}

Chosen Answer Index: ${answer}
Chosen Answer Text: ${q.options?.[answer]}

Explanation Provided:
${q.explanation}

Task:
Check whether the explanation logically and completely justifies
why the chosen answer is correct AND why the other options are incorrect.

Return ONLY one word:
YES
NO
`;
}



type VerifyResult =
  | { status: "OK"; answer: number }
  | { status: "REJECT" };



async function verifyQuestion(q: any, difficulty: string, geminiKey: string) {

  // async function singleVerify(model: string) {
  async function singleVerify(model: string): Promise<VerifyResult> {
    const { text } = await callGemini(
      verificationPrompt(q),
      geminiKey,
      model,
      0.2   // low temp for determinism
    );

    const clean = text.trim();

    // if (clean.includes("AMBIGUOUS") || clean.includes("INVALID")) {
    //   return { status: "REJECT" };
    // }

    const match = clean.match(/\b[0-3]\b/);
    if (!match) return { status: "REJECT" };

    return { status: "OK", answer: Number(match[0]) };
  }

  // Easy → single pass
  if (difficulty === "Easy") {
    const r = await singleVerify("gemini-2.5-flash");
    return r.status === "OK" && r.answer === Number(q.correctOption);
  }

  // Medium → single Flash 
  if (difficulty === "Medium") {
    const r1 = await singleVerify("gemini-2.5-flash");
    if (r1.status !== "OK") return false;

    // const r2 = await singleVerify("gemini-2.5-flash");
    // if (r2.status !== "OK") return false;

    // if (r1.answer !== r2.answer) return false;

    return r1.answer === Number(q.correctOption);
  }

  // Hard → Dual Flash cross-check
  // if (difficulty === "Hard") {
  //   const r1 = await singleVerify("gemini-2.5-flash");
  //   if (r1.status !== "OK") return false;

  //   const r2 = await singleVerify("gemini-2.5-flash");
  //   if (r2.status !== "OK") return false;

  //   if (r1.answer !== r2.answer) return false;

  //   console.log("---- HARD VERIFICATION ----");
  //   console.log("Question:", q.question);
  //   console.log("Generator correctOption:", q.correctOption);
  //   console.log("Verifier answer:", r1.answer);
  //   console.log("Verifier status:", r1.status);
  //   console.log("---------------------------");

  //   // return r1.answer === Number(q.correctOption);

  //   // 🔥 Overwrite correctOption
  //   q.correctOption = r1.answer;

  //   return true;
  // }


  if (difficulty === "Hard") {

    const r1 = await singleVerify("gemini-2.5-flash");
    if (r1.status !== "OK") return false;
  
    // Validate explanation consistency
    const { text: consistencyText } = await callGemini(
      explanationConsistencyPrompt(q, r1.answer),
      geminiKey,
      "gemini-2.5-flash",
      0.2
    );
  
    const result = consistencyText.trim().toUpperCase();
  
    if (result === "YES") {
      q.correctOption = r1.answer;
      return true;
    }
  
    return false;
  }  

  return false;
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

  Difficulty Guidelines:
    Easy:
    - Direct concept recall
    - No traps
    - Single-step reasoning
    - This question should take less than 30 seconds for a well-prepared candidate.

    Medium:
    - Multi-step reasoning
    - Mild distractors
    - Real exam-like structure
    - This question should take at least 1-1.25 minutes for a well-prepared candidate.

    Hard:
    - Multi-layer reasoning required
    - Time-consuming analytical steps
    - Comparable to actual ${exam} previous year questions
    - Exactly ONE option must be correct
    - The other three options must be clearly and definitively incorrect
    - Avoid interpretative ambiguity
    - Avoid partially correct options
    - Avoid tone-based or opinion-based logic
    - Question must have a logically provable answer
    - All four options must be mutually exclusive.
    - No two options may overlap in meaning.


  Explanation Rules:
  - First explain why the correct option is correct
  - Then briefly explain why each other option is incorrect
  - Keep total explanation within 4–6 concise lines
  - If two options could be defended, regenerate internally before returning


  Rules:
  - Return valid JSON only
  - Do not include markdown
  - Avoid unnecessary wording
  - Prefer concise options

  Before returning the JSON:
  - Solve the question yourself.
  - Re-solve the question to confirm the same answer.
  - Ensure exactly one option is correct.
  - Ensure correctOption index exactly matches that option.
  - Ensure removing any one incorrect option does NOT change the correct answer.
  - Ensure no option is partially correct.
  - If any ambiguity exists, regenerate internally before returning.
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

  if (q.type === "ASSERTION_REASON") {
    questionText = `
Assertion:
${q.assertion}

Reason:
${q.reason}
`;
  }

  else if (q.type === "PASSAGE") {
    questionText = `
Passage:
${q.passage}

Question:
${q.question}
`;
  }

  else if (q.type === "STATEMENT") {
    questionText = `
${q.question}

Statements:
${q.statements
      .map((s: string, i: number) => `${i + 1}. ${s}`)
      .join("\n")}
`;
  }

  else { // MCQ
    questionText = q.question;
  }

  return `
Solve the following question carefully and independently.

${questionText}

Options:
0. ${q.options?.[0]}
1. ${q.options?.[1]}
2. ${q.options?.[2]}
3. ${q.options?.[3]}

Rules:
- Exactly one option is logically correct. Choose that option.
- Do NOT explain.
- Otherwise return ONLY the correct option index (0-3)
`;
}



function difficultyAuditPrompt(q: any, exam: string) {
  let questionBlock = "";

  if (q.type === "ASSERTION_REASON") {
    questionBlock = `
Assertion:
${q.assertion}

Reason:
${q.reason}
`;
  }

  else if (q.type === "PASSAGE") {
    questionBlock = `
Passage:
${q.passage}

Question:
${q.question}
`;
  }

  else if (q.type === "STATEMENT") {
    questionBlock = `
${q.question}

Statements:
${q.statements
      ?.map((s: string, i: number) => `${i + 1}. ${s}`)
      .join("\n")}
`;
  }

  else { // MCQ
    questionBlock = q.question;
  }

  return `
Evaluate the difficulty level of this question for the ${exam} exam.

Return ONLY one word:
EASY
MEDIUM
HARD

Consider:
- Depth of reasoning required
- Time required for a well-prepared candidate
- Concept complexity
- Quality of distractors
- Whether it matches actual ${exam} previous-year standard

Question:
${questionBlock}

Options:
0. ${q.options?.[0]}
1. ${q.options?.[1]}
2. ${q.options?.[2]}
3. ${q.options?.[3]}
`;
}



async function difficultyAudit(
  q: any,
  exam: string,
  geminiKey: string
) {
  const { text } = await callGemini(
    difficultyAuditPrompt(q, exam),
    geminiKey,
    "gemini-2.5-flash",
    0.2 // deterministic
  );

  return text.trim().toUpperCase();
}



export const createGenerationJob = onCall(
  { secrets: [GEMINI_API_KEY],
    region: "asia-south1"
   },
  async (request) => {
    requireAdmin(request);

    const { exam, subject, type, count, difficulty } = request.data;

    if (!exam || !subject || !type || !count) {
      throw new HttpsError("invalid-argument", "Missing parameters");
    }

    // Setting Job Size Limits
    const maxLimit: Record<string, number> = {
      Easy: 60,
      Medium: 30,
      Hard: 10
    };
    
    const allowedMax = maxLimit[difficulty];
    
    if (!allowedMax) {
      throw new HttpsError("invalid-argument", "Invalid difficulty");
    }
    
    if (count > allowedMax) {
      throw new HttpsError(
        "invalid-argument",
        `Maximum allowed for ${difficulty} is ${allowedMax}`
      );
    }
    
    const batchMap: Record<string, number> = {
      Easy: 8,
      Medium: 5,
      Hard: 1
    };
    
    const batchSize = batchMap[difficulty] || 3;
    const totalBatches = Math.ceil(count / batchSize);    

    const jobRef = await admin.firestore()
      .collection("generationJobs")
      .add({
        exam,
        subject,
        type,
        difficulty,
        totalQuestions: count,

        // batchesTotal: totalBatches,
        // batchesCompleted: 0,

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



export const processGenerationJob = onDocumentWritten(
  {
    document: "generationJobs/{jobId}",
    secrets: [GEMINI_API_KEY],
    region: "asia-south1"
  },
  async (event) => {
    if (!event.data) return;

    const beforeSnap = event.data.before;
    const afterSnap = event.data.after;

    if (!afterSnap.exists) return;

    const jobRef = afterSnap.ref;
    const before = beforeSnap.data();
    const after = afterSnap.data();

    if (!after) return;

    // Only trigger when status transitions to RUNNING
    if (
      after.status !== "RUNNING" ||
      before?.status === "RUNNING"
    ) {
      return;
    }

    const {
      exam,
      subject,
      type,
      difficulty,
      batchesTotal,
      totalQuestions
    } = after;

    const geminiKey = process.env.GEMINI_API_KEY!;
    const db = admin.firestore();

    const batchMap: Record<string, number> = {
      Easy: 8,
      Medium: 5,
      Hard: 1
    };

    let effectiveBatchSize = batchMap[difficulty] || 3;

    let batchIndex = 0;


    async function runWorker() {
      console.log("Difficulty received:", difficulty);

      // const MAX_TOTAL_ATTEMPTS = Math.max(100, totalQuestions * 20);
      const MAX_TOTAL_ATTEMPTS = Math.max(40, totalQuestions * 10);
      // const MAX_TOTAL_ATTEMPTS =
      // difficulty === "Hard"
      //   ? 15
      //   : Math.max(40, totalQuestions * 10);

      let totalAttempts = 0;
    
      while (true) {
    
        const snapshot = await jobRef.get();
        const data = snapshot.data();
        if (!data) return;
    
        const currentApproved = data.approved || 0;
    
        // Stop based on approval count
        if (currentApproved >= totalQuestions) return;
    
        // Safety stop
        if (totalAttempts >= MAX_TOTAL_ATTEMPTS) return;
    
        const allowed = totalQuestions - currentApproved;
        const batchSize = Math.min(effectiveBatchSize, allowed);
    
        if (batchSize <= 0) return;
    
        let approvedDelta = 0;
        let rejectedDelta = 0;
    
        try {
    
          const generationModel = "gemini-2.5-flash";
    
          const { text, finishReason } = await callGemini(
            buildGenerationPrompt(
              exam,
              subject,
              type,
              batchSize,
              difficulty
            ),
            geminiKey,
            generationModel,
            difficulty === "Hard" ? 0.35 : 0.7
          );
    
          if (finishReason === "MAX_TOKENS") {
            effectiveBatchSize = Math.max(1, effectiveBatchSize - 1);
    
            await jobRef.update({
              generated: admin.firestore.FieldValue.increment(batchSize),
              rejected: admin.firestore.FieldValue.increment(batchSize),
              // batchesCompleted: admin.firestore.FieldValue.increment(1)
            });
    
            totalAttempts += batchSize;
            continue;
          }
    
          let questions: any[];
    
          try {
            const jsonStart = text.indexOf("[");
            const jsonEnd = text.lastIndexOf("]");
    
            if (jsonStart === -1 || jsonEnd === -1) {
              throw new Error("No JSON array found");
            }
    
            const cleaned = text.slice(jsonStart, jsonEnd + 1);
            questions = JSON.parse(cleaned);
    
          } catch {
    
            await jobRef.update({
              generated: admin.firestore.FieldValue.increment(batchSize),
              rejected: admin.firestore.FieldValue.increment(batchSize),
              // batchesCompleted: admin.firestore.FieldValue.increment(1)
            });
    
            totalAttempts += batchSize;
            continue;
          }
    
          const usableQuestions = questions.slice(0, batchSize);
    
          for (const q of usableQuestions) {
    
            const latestSnap = await jobRef.get();
            const approvedNow = latestSnap.data()?.approved || 0;
    
            if (approvedNow >= totalQuestions) return;
    
            try {
    
              const isApproved = await verifyQuestion(
                q,
                difficulty,
                geminiKey
              );
    
              if (!isApproved) {
                rejectedDelta++;
                continue;
              }
    
              // if (difficulty === "Medium") {
              //   const audited = await difficultyAudit(
              //     q,
              //     exam,
              //     geminiKey
              //   );
    
              //   if (audited !== "MEDIUM") {
              //     rejectedDelta++;
              //     continue;
              //   }
              // }
    
              approvedDelta++;
    
              await db.collection("questions").add({
                jobId: event.params.jobId,
                exam,
                subject,
                ...q,
                isActive: true,
                pipelineVersion: 3,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
              });
    
            } catch {
              rejectedDelta++;
            }
          }
    
          const totalProcessed = approvedDelta + rejectedDelta;
    
          await jobRef.update({
            generated: admin.firestore.FieldValue.increment(totalProcessed),
            approved: admin.firestore.FieldValue.increment(approvedDelta),
            rejected: admin.firestore.FieldValue.increment(rejectedDelta),
            // batchesCompleted: admin.firestore.FieldValue.increment(1)
          });
    
          totalAttempts += totalProcessed;
    
        } catch (err) {
    
          console.error("Batch failed:", err);
    
          // await jobRef.update({
          //   generated: admin.firestore.FieldValue.increment(batchSize),
          //   rejected: admin.firestore.FieldValue.increment(batchSize),
          //   // batchesCompleted: admin.firestore.FieldValue.increment(1)
          // });
    
          totalAttempts += batchSize;
          continue; // do NOT increment generated/rejected
        }
      }
    }        

    await Promise.all(
      Array.from({ length: MAX_CONCURRENCY }).map(() => runWorker())
    );


    const latest = await jobRef.get();
    const finalApproved = latest.data()?.approved || 0;

    if (latest.data()?.status === "RUNNING") {
      await jobRef.update({
        status:
          finalApproved >= totalQuestions
            ? "COMPLETED"
            : "PARTIAL",
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }
);



export const retryGenerationJob = onCall(
  { region: "asia-south1" },
  async (request) => {

    requireAdmin(request);

    const { jobId } = request.data;

    const jobRef = admin.firestore()
      .collection("generationJobs")
      .doc(jobId);

    await jobRef.update({
      status: "RUNNING",
      batchesCompleted: 0,
      generated: 0,
      approved: 0,
      rejected: 0,
      completedAt: admin.firestore.FieldValue.delete(),
      errorReason: admin.firestore.FieldValue.delete()
    });

    return { ok: true };
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

export { submitAttempt } from "./attempts/submitAttempt";
export { startQuiz } from "./attempts/startQuiz";