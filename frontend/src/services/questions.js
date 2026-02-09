import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "./firebase";

export async function fetchQuestions(exam, subject, count = 10) {
  const q = query(
    collection(db, "questions"),
    where("exam", "==", exam),
    where("subject", "==", subject),
    where("isActive", "==", true),
    limit(40)
  );

  const snap = await getDocs(q);
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all.slice(0, count);
}