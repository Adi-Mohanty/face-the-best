import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

export const submitAttempt = onCall(
  {
    cors: true,
    region: "asia-south1"
  },
  async (request) => {

    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const { exam, subject, responses, questions, startedAt, finishedAt } =
      request.data;

    if (!exam || !subject || !Array.isArray(responses) || !Array.isArray(questions)) {
      throw new HttpsError("invalid-argument", "Invalid payload");
    }

    if (questions.length === 0) {
      throw new HttpsError("invalid-argument", "No questions provided");
    }

    const db = admin.firestore();

    /* ---------------- SECURE SCORING ---------------- */

    const questionDocs = await Promise.all(
      questions.map((id: string) =>
        db.collection("questions").doc(id).get()
      )
    );

    const questionMap = new Map();
    questionDocs.forEach(doc => {
      if (doc.exists) {
        questionMap.set(doc.id, doc.data());
      }
    });

    const attempted = responses.filter(
      (r: any) => r.selectedOption !== null
    );

    let correctCount = 0;

    for (const r of attempted) {
      const q = questionMap.get(r.questionId);
      if (q && r.selectedOption === q.correctOption) {
        correctCount++;
      }
    }

    const totalQuestions = questions.length;

    const totalTimeMs =
      typeof startedAt === "number" &&
      typeof finishedAt === "number" &&
      finishedAt >= startedAt
        ? finishedAt - startedAt
        : 0;

    const avgTimeMs =
      attempted.length > 0
        ? Math.round(
            attempted.reduce(
              (sum: number, r: any) => sum + (r.timeTakenMs || 0),
              0
            ) / attempted.length
          )
        : 0;

    const result = {
      score: correctCount,
      accuracy:
        totalQuestions > 0
          ? correctCount / totalQuestions
          : 0,
      correctCount,
      attemptedCount: attempted.length,
      skippedCount: totalQuestions - attempted.length,
      totalQuestions,
      totalTimeMs,
      avgTimeMs
    };

    /* ---------------- TRANSACTION ---------------- */

    const attemptRef = db.collection("attempts").doc();

    await db.runTransaction(async (tx) => {
      const statsRef = db.collection("userStats").doc(uid);
      const snap = await tx.get(statsRef);

      const prev = snap.exists ? snap.data()! : {
        totals: {
          attempts: 0,
          questionsAttempted: 0,
          correctAnswers: 0,
          timeSpentMs: 0
        }
      };

      tx.set(attemptRef, {
        attemptId: attemptRef.id,
        userId: uid,
        examId: exam.id,
        examType: exam.type,
        subjectId: subject.id,
        subjectName: subject.name,
        mode: "QUIZ",
        questions,
        responses,
        result,
        status: "COMPLETED",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      tx.set(
        statsRef,
        {
          userId: uid,
          totals: {
            attempts: prev.totals.attempts + 1,
            questionsAttempted:
              prev.totals.questionsAttempted + attempted.length,
            correctAnswers:
              prev.totals.correctAnswers + correctCount,
            timeSpentMs:
              prev.totals.timeSpentMs + totalTimeMs
          },
          lastUpdated:
            admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    });

    return {
      attemptId: attemptRef.id,
      result
    };
  }
);