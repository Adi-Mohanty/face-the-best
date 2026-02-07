import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";

export default function AdminRoute({ children }) {
  const [state, setState] = useState("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return setState("unauth");

      const token = await getIdTokenResult(user, true);
      setState(token.claims.admin ? "ok" : "forbidden");
    });
    return unsub;
  }, []);

  if (state === "loading") return null;
  if (state === "unauth") return <Navigate to="/login" />;
  if (state === "forbidden") return <Navigate to="/exams" />;

  return children;
}
