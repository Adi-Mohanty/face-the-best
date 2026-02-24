import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function ApprovedQuestionsModal({ jobId, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      const q = query(
        collection(db, "questions"),
        where("jobId", "==", jobId)
      );

      const snap = await getDocs(q);
      setQuestions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    loadQuestions();
  }, [jobId]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card large" onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose} className="close-btn">✕</button>

        <h3 className="title">
          Approved Questions ({questions.length})
        </h3>

        {loading && <p>Loading...</p>}

        {!loading && questions.map((q, index) => (
          <div key={q.id} className="question-card">
            <p className="question-title">
              Q{index + 1}. {q.question || q.assertion}
            </p>

            {q.options?.map((opt, i) => (
              <div
                key={i}
                className={`option ${i === q.correctOption ? "correct" : ""}`}
              >
                {i}. {opt}
              </div>
            ))}

            <p className="explanation">{q.explanation}</p>
          </div>
        ))}

      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:2000;
        }

        .modal-card.large {
          position: relative;
          width: 850px;
          max-height: 80vh;
          overflow-y: auto;
          padding: 30px;
          border-radius: 28px;
          background: white;
        }

        .question-card {
          padding: 16px;
          border-radius: 14px;
          background: #f8fafc;
          margin-bottom: 14px;
        }

        .question-title {
          font-weight: 700;
          margin-bottom: 8px;
        }

        .option {
          font-size: 13px;
          padding: 4px 0;
        }

        .option.correct {
          font-weight: 700;
          color: #16a34a;
        }

        .explanation {
          font-size: 12px;
          margin-top: 8px;
          color: #64748b;
        }

        .close-btn {
          position:absolute;
          top:18px;
          right:22px;
          background:none;
          border:none;
          font-size:18px;
          cursor:pointer;
        }
      `}</style>
    </div>
  );
}