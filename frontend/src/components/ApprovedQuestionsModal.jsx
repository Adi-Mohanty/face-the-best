import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function ApprovedQuestionsModal({ jobId, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobMeta, setJobMeta] = useState(null);
  const [openExplanation, setOpenExplanation] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      const q = query(
        collection(db, "questions"),
        where("jobId", "==", jobId)
      );

      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      setQuestions(data);

      // Extract job-level metadata from first question
      if (data.length > 0) {
        setJobMeta({
          exam: data[0].exam,
          subject: data[0].subject,
          type: data[0].type,
          difficulty: data[0].difficulty
        });
      }

      setLoading(false);
    };

    loadQuestions();
  }, [jobId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ================= HEADER ================= */}
        <div className="modal-header">

          <div className="header-left">
            <h3>
              Approved Questions ({questions.length})
            </h3>

            {jobMeta && (
              <div className="job-badges">
                <span className="badge exam">
                  {jobMeta.exam}
                </span>

                <span className="badge subject">
                  {jobMeta.subject}
                </span>

                <span className="badge type">
                  {jobMeta.type}
                </span>

                <span className={`badge difficulty ${jobMeta.difficulty?.toLowerCase()}`}>
                  {jobMeta.difficulty}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="close-btn"
          >
            ✕
          </button>

        </div>

        {loading && <p>Loading...</p>}

        {!loading && questions.map((q, index) => (
          <div key={q.id} className="question-card">

            <p className="question-number">
              Q{index + 1}
            </p>

            {/* ===== TYPE RENDERING ===== */}

            {q.type === "MCQ" && (
              <p className="question-text">
                {q.question}
              </p>
            )}

            {q.type === "STATEMENT" && (
              <>
                <p className="question-text">
                  {q.question}
                </p>
                <div className="info-box">
                  {q.statements?.map((s, i) => (
                    <div key={i}>
                      <strong>{i + 1}.</strong> {s}
                    </div>
                  ))}
                </div>
              </>
            )}

            {q.type === "ASSERTION_REASON" && (
              <>
                <div className="info-box">
                  <strong>Assertion:</strong>
                  <p>{q.assertion}</p>
                </div>

                <div className="info-box">
                  <strong>Reason:</strong>
                  <p>{q.reason}</p>
                </div>
              </>
            )}

            {q.type === "PASSAGE" && (
              <>
                <div className="passage-box">
                  {q.passage}
                </div>
                <p className="question-text">
                  {q.question}
                </p>
              </>
            )}

            {/* OPTIONS */}
            {q.options?.length > 0 && (
              <div className="options">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`option ${
                      i === q.correctOption ? "correct" : ""
                    }`}
                  >
                    <strong>
                      {String.fromCharCode(65 + i)}.
                    </strong>{" "}
                    {opt}
                  </div>
                ))}
              </div>
            )}

            {/* COLLAPSIBLE EXPLANATION */}
            <div className="explanation-section">
              <button
                className="explanation-toggle"
                onClick={() =>
                  setOpenExplanation(
                    openExplanation === q.id
                      ? null
                      : q.id
                  )
                }
              >
                {openExplanation === q.id
                  ? "Hide Explanation"
                  : "View Explanation"}
              </button>

              <div
                className={`explanation-box ${
                  openExplanation === q.id
                    ? "open"
                    : ""
                }`}
              >
                <p>{q.explanation}</p>
              </div>
            </div>

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

        .modal-card {
          width: 1000px;
          max-height: 85vh;
          overflow-y: auto;
          border-radius: 28px;
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            20px 20px 40px rgba(0,0,0,0.15),
            -10px -10px 25px rgba(255,255,255,0.8);
        }

        /* Scrollbar */
        .modal-card::-webkit-scrollbar {
          width:8px;
        }

        .modal-card::-webkit-scrollbar-thumb {
          background:#cbd5e1;
          border-radius:20px;
        }

        /* HEADER */
        .modal-header {
          position: sticky;
          top: 0;
          z-index: 10;
          padding:20px 28px;
          border-bottom:1px solid #e2e8f0;
          display:flex;
          justify-content:space-between;
          align-items:center;
          background: linear-gradient(145deg,#ffffff,#e8edf5);
        }

        .header-left h3 {
          font-size:16px;
          font-weight:800;
          margin-bottom:8px;
        }

        .job-badges {
          display:flex;
          gap:6px;
          flex-wrap:wrap;
        }

        .badge {
          font-size:10px;
          padding:4px 8px;
          border-radius:10px;
          font-weight:600;
          color:white;
        }

        .badge.exam { background:#1e293b; }
        .badge.subject { background:#64748b; }
        .badge.type { background:#4f46e5; }
        .badge.difficulty.easy { background:#16a34a; }
        .badge.difficulty.medium { background:#f59e0b; }
        .badge.difficulty.hard { background:#dc2626; }

        .close-btn {
          padding:6px 12px;
          border-radius:12px;
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            5px 5px 10px rgba(0,0,0,0.1),
            -3px -3px 8px rgba(255,255,255,0.9);
          cursor:pointer;
        }

        .close-btn:active {
          transform: translateY(2px);
          box-shadow:
            inset 3px 3px 8px rgba(0,0,0,0.2);
        }

        .question-card {
          padding:22px 28px;
          border-bottom:1px solid #e2e8f0;
        }

        .question-number {
          font-weight:800;
          margin-bottom:8px;
        }

        .question-text {
          font-weight:600;
          margin-bottom:10px;
        }

        .info-box,
        .passage-box {
          padding:12px;
          border-radius:14px;
          background:#f1f5f9;
          margin-bottom:10px;
          font-size:13px;
        }

        .options {
          margin-top:8px;
        }

        .option {
          padding:8px;
          border-radius:10px;
          margin-bottom:6px;
          font-size:13px;
          background:#f8fafc;
        }

        .option.correct {
          background:#dcfce7;
          font-weight:700;
          box-shadow:
            inset 3px 3px 8px rgba(22,163,74,0.25);
        }

        .explanation-toggle {
          font-size:11px;
          background:none;
          border:none;
          color:#4f46e5;
          cursor:pointer;
        }

        .explanation-box {
          max-height:0;
          overflow:hidden;
          transition:all .3s ease;
          font-size:12px;
          margin-top:6px;
        }

        .explanation-box.open {
          max-height:200px;
        }

      `}</style>
    </div>
  );
}