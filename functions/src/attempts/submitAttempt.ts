import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

export const submitAttempt = onCall(
  { cors: true, region: "asia-south1" },
  async (request) => {

    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const { attemptId, responses } = request.data;

    if (!attemptId || !Array.isArray(responses)) {
      throw new HttpsError("invalid-argument", "Invalid payload");
    }

    const db = admin.firestore();
    const attemptRef = db.collection("attempts").doc(attemptId);
    const attemptDoc = await attemptRef.get();

    if (!attemptDoc.exists) {
      throw new HttpsError("not-found", "Attempt not found");
    }

    const attempt = attemptDoc.data()!;

    if (attempt.userId !== uid) {
      throw new HttpsError("permission-denied", "Unauthorized");
    }

    if (attempt.status !== "IN_PROGRESS") {
      throw new HttpsError("failed-precondition", "Attempt already completed");
    }

    const questionIds: string[] = attempt.questionIds;

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      throw new HttpsError("invalid-argument", "Invalid stored questions");
    }

    // ---------- Efficient batch fetch ----------

    const chunkSize = 10;
    const chunks: string[][] = [];

    for (let i = 0; i < questionIds.length; i += chunkSize) {
      chunks.push(questionIds.slice(i, i + chunkSize));
    }

    const questionMap = new Map<string, any>();

    for (const chunk of chunks) {
      const snap = await db
        .collection("questions")
        .where(admin.firestore.FieldPath.documentId(), "in", chunk)
        .get();

      snap.forEach(doc => {
        questionMap.set(doc.id, doc.data());
      });
    }

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

    const totalQuestions = questionIds.length;

    const startedAt = attempt.startedAt?.toMillis?.() ?? 0;
    const serverNow = Date.now();
    const MAX_DURATION_MS = 600 * 1000;

    if (serverNow - startedAt > MAX_DURATION_MS + 15000) {
      throw new HttpsError("failed-precondition", "Attempt expired");
    }

    const totalTimeMs = Math.min(serverNow - startedAt, MAX_DURATION_MS);

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
      accuracy: totalQuestions > 0 ? correctCount / totalQuestions : 0,
      correctCount,
      attemptedCount: attempted.length,
      skippedCount: totalQuestions - attempted.length,
      totalQuestions,
      totalTimeMs,
      avgTimeMs
    };

    await db.runTransaction(async (tx) => {

      const statsRef = db.collection("userStats").doc(uid);
      const statsSnap = await tx.get(statsRef);

      const prev = statsSnap.exists ? statsSnap.data()! : {
        totals: {
          attempts: 0,
          questionsAttempted: 0,
          correctAnswers: 0,
          timeSpentMs: 0
        }
      };

      tx.update(attemptRef, {
        responses,
        result,
        status: "COMPLETED",
        finishedAt: admin.firestore.FieldValue.serverTimestamp()
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
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    });

    return { attemptId, result };
  }
);