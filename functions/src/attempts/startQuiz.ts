import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

interface Question {
  id: string;
  exam: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  correctOption: number;
  [key: string]: any;
}

function shuffle(arr: any[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type DifficultyKey = "easy" | "medium" | "hard";

function calculateDistribution(
  count: number,
  config: Record<DifficultyKey, number>
): Record<DifficultyKey, number> {
  const raw = {
    easy: (config.easy / 100) * count,
    medium: (config.medium / 100) * count,
    hard: (config.hard / 100) * count
  };

  const result: Record<DifficultyKey, number> = {
    easy: Math.floor(raw.easy),
    medium: Math.floor(raw.medium),
    hard: Math.floor(raw.hard)
  };

  let allocated = result.easy + result.medium + result.hard;
  let remainder = count - allocated;

  const baseOrder: DifficultyKey[] = ["easy", "medium", "hard"];

  const order = baseOrder.sort(
    (a, b) => config[b] - config[a]
  );

  let i = 0;
  while (remainder > 0) {
    result[order[i % 3]]++;
    remainder--;
    i++;
  }

  return result;
}

export const startQuiz = onCall(
  { region: "asia-south1", cors: true },
  async (request) => {

    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const { exam, subject, count = 10 } = request.data;

    if (!exam?.id || !subject?.id) {
      throw new HttpsError("invalid-argument", "Invalid payload");
    }

    const db = admin.firestore();

    // =====================================================
    // 1️⃣ FETCH ALL ELIGIBLE QUESTIONS
    // =====================================================

    const snap = await db
      .collection("questions")
      .where("exam", "==", exam.type)
      .where("subject", "==", subject.name)
      .where("isActive", "==", true)
      .get();

    const all: Question[] = snap.docs.map(d => ({
      ...(d.data() as Question),
      id: d.id
    }));

    if (all.length < count) {
      throw new HttpsError("failed-precondition", "Not enough questions");
    }

    const config =
      exam.subjectConfig?.[subject.id] || {
        easy: 33,
        medium: 34,
        hard: 33
      };

    const required = calculateDistribution(count, config);

    const easyPool = shuffle(all.filter(q => q.difficulty === "Easy"));
    const mediumPool = shuffle(all.filter(q => q.difficulty === "Medium"));
    const hardPool = shuffle(all.filter(q => q.difficulty === "Hard"));

    const take = (pool: any[], n: number) => {
      const taken = pool.slice(0, n);
      pool.splice(0, n);
      return taken;
    };

    let selected = [
      ...take(easyPool, required.easy),
      ...take(mediumPool, required.medium),
      ...take(hardPool, required.hard)
    ];

    if (selected.length < count) {
      const remaining = shuffle([
        ...easyPool,
        ...mediumPool,
        ...hardPool
      ]);
      selected = [...selected, ...remaining.slice(0, count - selected.length)];
    }

    selected = shuffle(selected);

    // =====================================================
    // 2️⃣ ATOMIC CHECK + CREATE (RACE SAFE)
    // =====================================================

    const attemptId = await db.runTransaction(async (tx) => {

      const existingSnap = await tx.get(
        db.collection("attempts")
          .where("userId", "==", uid)
          .where("examId", "==", exam.id)
          .where("subjectId", "==", subject.id)
          .where("status", "==", "IN_PROGRESS")
          .limit(1)
      );

      if (!existingSnap.empty) {
        return existingSnap.docs[0].id;
      }

      const attemptRef = db.collection("attempts").doc();

      tx.set(attemptRef, {
        attemptId: attemptRef.id,
        userId: uid,
        examId: exam.id,
        examType: exam.type,
        subjectId: subject.id,
        subjectName: subject.name,
        questionIds: selected.map(q => q.id),
        status: "IN_PROGRESS",
        startedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return attemptRef.id;
    });

    // =====================================================
    // 3️⃣ FETCH QUESTIONS FROM STORED ATTEMPT (SOURCE OF TRUTH)
    // =====================================================

    const attemptDoc = await db.collection("attempts").doc(attemptId).get();
    const storedIds: string[] = attemptDoc.data()!.questionIds;

    const chunkSize = 10;
    const chunks: string[][] = [];

    for (let i = 0; i < storedIds.length; i += chunkSize) {
      chunks.push(storedIds.slice(i, i + chunkSize));
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

    const orderedQuestions = storedIds.map(id => {
      const q = questionMap.get(id);
      if (!q) {
        throw new HttpsError("not-found", "Question missing");
      }
      const { correctOption, ...rest } = q;
      return { id, ...rest };
    });

    return {
      attemptId,
      questions: orderedQuestions
    };
  }
);