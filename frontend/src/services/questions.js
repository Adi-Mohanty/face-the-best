import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "./firebase";

export const fetchQuestions = async (exam, subject) => {
  const q = query(
    collection(db, "questions"),
    where("exam", "==", exam),
    where("subject", "==", subject),
    limit(10)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};