import { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

function createEmptyQuestion(type = "MCQ") {
    return {
      type,
      difficulty: "Easy",
      question: "",
      passage: "",
      assertion: "",
      reason: "",
      statements: ["", ""], // minimum 2
      options: ["", "", "", ""],
      correctOption: 0,
      explanation: ""
    };
}

export default function ManualAddQuestions() {
  const navigate = useNavigate();

  const [examId, setExamId] = useState("");
  const [subject, setSubject] = useState("");
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([
    createEmptyQuestion()
  ]);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const isSaveDisabled = !examId || !subject;
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saveCompleted, setSaveCompleted] = useState(false);
  const [failedQuestions, setFailedQuestions] = useState([]);
  const [saveError, setSaveError] = useState(null);

  /* ---------------- LOAD EXAMS + SUBJECTS ---------------- */
  useEffect(() => {
    const load = async () => {
      const examsSnap = await getDocs(collection(db, "exams"));
      const subjectsSnap = await getDocs(collection(db, "subjects"));

      setExams(examsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setSubjects(subjectsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    load();
  }, []);

  /* ---------------- FILTER SUBJECTS BASED ON EXAM ---------------- */
  const selectedExam = useMemo(
    () => exams.find(ex => ex.id === examId),
    [examId, exams]
  );

  const filteredSubjects = useMemo(() => {
    if (!selectedExam) return [];
    return subjects.filter(sub =>
      selectedExam.subjects?.includes(sub.id)
    );
  }, [selectedExam, subjects]);

  /* ---------------- UPDATE FUNCTIONS ---------------- */

  const updateQuestion = (index, field, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const updateOption = (qIndex, optIndex, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIndex].options[optIndex] = value;
      return copy;
    });
  };

  const updateStatement = (qIndex, sIndex, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIndex].statements[sIndex] = value;
      return copy;
    });
  };

  const addStatement = (qIndex) => {
    setQuestions(prev =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, statements: [...q.statements, ""] }
          : q
      )
    );
  };

  const removeStatement = (qIndex, sIndex) => {
    setQuestions(prev =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
  
        if (q.statements.length <= 2) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [`statement-count-${qIndex}`]:
              "Minimum 2 statements required"
          }));
          return q;
        }
  
        const updatedStatements = q.statements.filter(
          (_, idx) => idx !== sIndex
        );
  
        // Clear error if now valid
        setErrors(prevErrors => {
          const copy = { ...prevErrors };
          delete copy[`statement-count-${qIndex}`];
          return copy;
        });
  
        return {
          ...q,
          statements: updatedStatements
        };
      })
    );
  };

  const addQuestionBlock = () => {
    setQuestions(prev => [...prev, createEmptyQuestion()]);
  };

  const removeQuestionBlock = (index) => {
    if (questions.length === 1) return; // must have at least 1
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };


  const validate = () => {
    const newErrors = {};
  
    if (!examId) newErrors.exam = "Exam is required";
    if (!subject) newErrors.subject = "Subject is required";
  
    questions.forEach((q, index) => {
      const base = `q-${index}`;
  
      // Explanation required
      if (!q.explanation.trim()) {
        newErrors[`exp-${index}`] = "Explanation is required";
      }
  
      // Options required
      if (q.options.some(opt => !opt.trim())) {
        newErrors[`opt-${index}`] = "All options must be filled";
      }
  
      // Type specific validation
      if (q.type === "MCQ") {
        if (!q.question.trim())
          newErrors[`question-${index}`] = "Question is required";
      }
  
      if (q.type === "STATEMENT") {
        if (!q.question.trim())
          newErrors[`question-${index}`] = "Main question is required";
  
        if (q.statements.length < 2)
          newErrors[`statement-count-${index}`] =
            "Minimum 2 statements required";
  
        if (q.statements.some(s => !s.trim()))
          newErrors[`statement-${index}`] =
            "All statements must be filled";
      }
  
      if (q.type === "ASSERTION_REASON") {
        if (!q.assertion.trim())
          newErrors[`assertion-${index}`] =
            "Assertion is required";
  
        if (!q.reason.trim())
          newErrors[`reason-${index}`] =
            "Reason is required";
      }
  
      if (q.type === "PASSAGE") {
        if (!q.passage.trim())
          newErrors[`passage-${index}`] =
            "Passage is required";
  
        if (!q.question.trim())
          newErrors[`question-${index}`] =
            "Question is required";
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!navigator.onLine) {
      setSaveError("You are offline. Please check your connection.");
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    setProgress(0);
    setSaveCompleted(false);
    setFailedQuestions([]);
    setSaveError(null);
  
    const total = questions.length;
    let completed = 0;
    const failures = [];
  
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
  
      try {
        const payload = {
          exam: selectedExam.type,
          subject,
          type: q.type,
          difficulty: q.difficulty,
          options: q.options,
          correctOption: q.correctOption,
          explanation: q.explanation,
          isActive: true,
          pipelineVersion: 4,
          createdAt: serverTimestamp()
        };
  
        if (q.type === "MCQ") payload.question = q.question;
        if (q.type === "STATEMENT") {
          payload.question = q.question;
          payload.statements = q.statements;
        }
        if (q.type === "ASSERTION_REASON") {
          payload.assertion = q.assertion;
          payload.reason = q.reason;
        }
        if (q.type === "PASSAGE") {
          payload.passage = q.passage;
          payload.question = q.question;
        }
  
        await addDoc(collection(db, "questions"), payload);
  
      } catch (error) {
        failures.push({
          index: i,
          question: q,
          error: error.message || "Unknown error"
        });
      }
  
      completed++;
      setProgress(Math.round((completed / total) * 100));
    }
  
    setIsSaving(false);
  
    if (failures.length > 0) {
      setFailedQuestions(failures);
      setSaveError(
        `${failures.length} out of ${total} question(s) failed to save.`
      );
    } else {
      setSaveCompleted(true);
    }
  };

  /* ---------------- RETRY ---------------- */

  const retryFailed = async () => {
    setIsSaving(true);
    setProgress(0);
  
    const total = failedQuestions.length;
    let completed = 0;
    const stillFailing = [];
  
    for (let f of failedQuestions) {
      try {
        await addDoc(collection(db, "questions"), {
          exam: selectedExam.type,
          subject,
          ...f.question,
          isActive: true,
          pipelineVersion: 4,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        stillFailing.push({
          ...f,
          error: error.message || "Retry failed"
        });
      }
  
      completed++;
      setProgress(Math.round((completed / total) * 100));
    }
  
    setIsSaving(false);
  
    if (stillFailing.length > 0) {
      setFailedQuestions(stillFailing);
      setSaveError(
        `${stillFailing.length} question(s) still failing.`
      );
    } else {
      setFailedQuestions([]);
      setSaveError(null);
      setSaveCompleted(true);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="admin-bg min-h-screen font-display">
      <main className="max-w-[1200px] mx-auto px-6 py-10">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">
            Manual Question Editor
          </h1>

          <button
            onClick={() => navigate("/admin/questions")}
            className="skeuo-back-btn"
          >
            ← Back
          </button>
        </div>

        {/* Exam + Subject */}
        <div className="skeuo-card p-6 mb-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="skeuo-label">Exam</label>
              <select
                value={examId}
                onChange={e => {
                  setExamId(e.target.value);
                  setSubject("");
                }}
                className="skeuo-input"
              >
                <option value="">Select Exam</option>
                {exams.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.type}
                  </option>
                ))}
              </select>
              {errors.exam && <p className="error-text">{errors.exam}</p>}
            </div>
  
            <div>
              <label className="skeuo-label">Subject</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                disabled={!examId}
                className="skeuo-input"
              >
                <option value="">
                  {examId ? "Select Subject" : "Select Exam first"}
                </option>
  
                {filteredSubjects.map(sub => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="error-text">{errors.subject}</p>}
            </div>
          </div>
        </div>

        {/* QUESTION BLOCKS */}
        {questions.map((q, index) => (
          <div key={index} className="skeuo-card p-6 mb-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">
                Question {index + 1}
              </h2>

              <button
                onClick={() => removeQuestionBlock(index)}
                className="skeuo-danger-btn"
              >
                Remove
              </button>
            </div>

            {/* TYPE + DIFFICULTY */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="skeuo-label">Type</label>
                <select
                  value={q.type}
                  onChange={e =>
                    updateQuestion(index, "type", e.target.value)
                  }
                  className="skeuo-input"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="STATEMENT">Statement</option>
                  <option value="ASSERTION_REASON">Assertion-Reason</option>
                  <option value="PASSAGE">Passage</option>
                </select>
              </div>

              <div>
                <label className="skeuo-label">Difficulty</label>
                <select
                  value={q.difficulty}
                  onChange={e =>
                    updateQuestion(index, "difficulty", e.target.value)
                  }
                  className="skeuo-input"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* DYNAMIC FIELDS */}
            {q.type === "MCQ" && (
              <>
                <label className="skeuo-label">Question</label>
                <textarea
                  placeholder="Question"
                  value={q.question}
                  onChange={e =>
                  updateQuestion(index, "question", e.target.value)
                  }
                  className="skeuo-input"
                />
                {errors[`q-${index}`] && (
                  <p className="error-text">
                    {errors[`q-${index}`]}
                  </p>
                )}
              </>
            )}

            {q.type === "STATEMENT" && (
              <>
                <label className="skeuo-label">Main Question</label>
                <textarea
                  value={q.question}
                  onChange={e =>
                    updateQuestion(index, "question", e.target.value)
                  }
                  className="skeuo-input"
                />
                {errors[`question-${index}`] && (
                  <p className="error-text">
                    {errors[`question-${index}`]}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <label className="skeuo-label mb-0">
                    Statements
                  </label>

                  <button
                    onClick={() => addStatement(index)}
                    className="skeuo-mini-btn"
                  >
                    + Add
                  </button>
                </div>

                {q.statements.map((s, i) => (
                  <>
                    <div key={i} className="flex gap-2">
                      <input
                        value={s}
                        onChange={e =>
                          updateStatement(index, i, e.target.value)
                        }
                        className="skeuo-input"
                      />
                      <button
                        onClick={() => removeStatement(index, i)}
                        className="skeuo-danger-btn"
                      >
                        ✕
                      </button>
                    </div>
                    {errors[`statement-${index}`] && (
                      <p className="error-text">
                        {errors[`statement-${index}`]}
                      </p>
                    )}
                    {errors[`statement-count-${index}`] && (
                      <p className="error-text">
                        {errors[`statement-count-${index}`]}
                      </p>
                    )}
                  </>
                ))}
              </>
            )}

            {q.type === "ASSERTION_REASON" && (
              <>
                <label className="skeuo-label">Assertion</label>
                <textarea
                  placeholder="Assertion"
                  value={q.assertion}
                  onChange={e =>
                    updateQuestion(index, "assertion", e.target.value)
                  }
                  className="skeuo-input"
                />
                {errors[`assertion-${index}`] && (
                  <p className="error-text">
                    {errors[`assertion-${index}`]}
                  </p>
                )}

                <label className="skeuo-label">Reason</label>
                <textarea
                  placeholder="Reason"
                  value={q.reason}
                  onChange={e =>
                    updateQuestion(index, "reason", e.target.value)
                  }
                  className="skeuo-input"
                />
                {errors[`reason-${index}`] && (
                  <p className="error-text">
                    {errors[`reason-${index}`]}
                  </p>
                )}
              </>
            )}

            {q.type === "PASSAGE" && (
              <>
                <label className="skeuo-label">Passage</label>
                <textarea
                  placeholder="Passage"
                  value={q.passage}
                  onChange={e =>
                    updateQuestion(index, "passage", e.target.value)
                  }
                  className="skeuo-input"
                />
                {errors[`passage-${index}`] && (
                  <p className="error-text">
                    {errors[`passage-${index}`]}
                  </p>
                )}

                <label className="skeuo-label">Question</label>
                <textarea
                  placeholder="Question"
                  value={q.question}
                  onChange={e =>
                    updateQuestion(index, "question", e.target.value)
                  }
                  className="skeuo-input"
                />
                {errors[`question-${index}`] && (
                  <p className="error-text">
                    {errors[`question-${index}`]}
                  </p>
                )}
              </>
            )}

            {/* OPTIONS */}
            <>
              <label className="skeuo-label">Options</label>
              {q.options.map((opt, i) => (
                <input
                    key={i}
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={e =>
                    updateOption(index, i, e.target.value)
                    }
                    className="skeuo-input"
                />
              ))}
              {errors[`opt-${index}`] && (
                <p className="error-text">
                  {errors[`opt-${index}`]}
                </p>
              )}
            </>

            {/* CORRECT OPTION */}
            <label className="skeuo-label">Correct Option</label>
            <select
              value={q.correctOption}
              onChange={e =>
                updateQuestion(index, "correctOption", Number(e.target.value))
              }
              className="skeuo-input"
            >
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>


            <label className="skeuo-label">Explanation</label>
            <textarea
              placeholder="Explanation"
              value={q.explanation}
              onChange={e =>
                updateQuestion(index, "explanation", e.target.value)
              }
              className="skeuo-input"
            />
            {errors[`exp-${index}`] && (
              <p className="error-text">
                {errors[`exp-${index}`]}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-between gap-4">
          <button
            onClick={addQuestionBlock}
            disabled={false}
            className="skeuo-secondary-btn"
          >
            + Add Another
          </button>

          <button
            onClick={() => {
              if (validate()) setShowConfirm(true);
            }}
            disabled={isSaveDisabled}
            className={`skeuo-primary-btn ${
              isSaveDisabled ? "disabled-btn" : ""
            }`}
          >
            Save All
          </button>
        </div>


        {showConfirm && (
          <div className="modal-overlay">
            <div className="skeuo-card modal-box p-6">
              {!isSaving && !saveCompleted && (
                <>
                  <h3 className="font-bold text-lg mb-4">
                    Confirm Submission
                  </h3>

                  <p className="text-sm mb-6">
                    You are about to add {questions.length} question(s).
                  </p>

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="skeuo-secondary-btn"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`skeuo-primary-btn ${
                        isSaving ? "disabled-btn" : ""
                      }`}
                    >
                      Confirm & Save
                    </button>
                  </div>
                </>
              )}

              {(isSaving || saveCompleted) && (
                <>
                  <div className="progress-wrapper">
                    <div className="water-circle">
                      <div
                        className="water"
                        style={{ height: `${progress}%` }}
                      >
                        <div className="wave wave1" />
                        <div className="wave wave2" />
                      </div>

                      <div className="progress-text">
                        {progress}%
                      </div>
                    </div>
                  </div>

                  {saveCompleted && (
                    <div className="text-center mt-6">
                      <p className="font-bold text-green-600 mb-4">
                        ✔ Questions Added Successfully
                      </p>

                      <button
                        onClick={() => navigate("/admin/questions")}
                        className="skeuo-primary-btn"
                      >
                        Back to Dashboard
                      </button>
                    </div>
                  )}
                </>
              )}

              {saveError && (
                <div className="mt-6 text-center">
                  <p className="text-red-600 font-bold mb-2">
                    ❌ Save Failed
                  </p>

                  <p className="text-sm mb-4">
                    {saveError}
                  </p>

                  <div className="max-h-32 overflow-y-auto text-left text-xs bg-red-50 p-3 rounded-lg">
                    {failedQuestions.map(f => (
                      <div key={f.index} className="mb-2">
                        <strong>Question {f.index + 1}:</strong>
                        <br />
                        {f.error}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() => {
                        setShowConfirm(false);
                      }}
                      className="skeuo-secondary-btn"
                    >
                      Close
                    </button>

                    <button
                      onClick={retryFailed}
                      className="skeuo-primary-btn"
                    >
                      Retry Failed
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-bg {
          background: linear-gradient(145deg,#f1f5f9,#e2e8f0);
        }

        .skeuo-card {
          border-radius:22px;
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            10px 10px 20px rgba(0,0,0,0.08),
            -6px -6px 14px rgba(255,255,255,0.9);
          border:1px solid #e5e7eb;
        }

        .skeuo-label {
          font-size:12px;
          font-weight:700;
          margin-bottom:6px;
          display:block;
          color:#475569;
        }

        .skeuo-input {
          width:100%;
          padding:12px;
          border-radius:14px;
          border:1px solid #e2e8f0;
          background:#f4f6f9;
          box-shadow:
            inset 4px 4px 8px rgba(0,0,0,0.05),
            inset -4px -4px 8px rgba(255,255,255,0.9);
        }

        .error-text {
          color:#dc2626;
          font-size:12px;
          margin-top:4px;
        }

        .skeuo-primary-btn {
          padding:14px 28px;
          border-radius:16px;
          background: linear-gradient(to bottom,#6366f1,#4f46e5);
          color:white;
          font-weight:700;
          box-shadow:0 8px 18px rgba(79,70,229,0.35);
        }

        .skeuo-primary-btn:disabled {
          opacity:0.5;
          cursor:not-allowed;
        }

        .skeuo-secondary-btn {
          padding:10px 18px;
          border-radius:14px;
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            6px 6px 14px rgba(0,0,0,0.08),
            -4px -4px 10px rgba(255,255,255,0.9);
        }

        .skeuo-danger-btn {
          padding:10px 16px;
          border-radius:14px;
          border:none;

          background: linear-gradient(145deg,#fee2e2,#fecaca);
          color:#dc2626;
          font-weight:700;

          box-shadow:
            6px 6px 14px rgba(0,0,0,0.08),
            -4px -4px 10px rgba(255,255,255,0.9);

          transition: all .15s ease;
        }

        .skeuo-danger-btn:hover {
          transform: translateY(-2px);
        }

        .skeuo-danger-btn:active {
          transform: translateY(2px);
          box-shadow:
            inset 4px 4px 8px rgba(0,0,0,0.2);
        }

        .skeuo-back-btn {
          padding:10px 20px;
          border-radius:14px;
          font-size:14px;
          font-weight:600;
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            6px 6px 14px rgba(0,0,0,0.2),
            -4px -4px 10px rgba(255,255,255,0.9);
        }

        .skeuo-mini-btn {
          padding:6px 12px;
          border-radius:12px;
          font-size:12px;
          font-weight:600;
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            4px 4px 10px rgba(0,0,0,0.08),
            -3px -3px 8px rgba(255,255,255,0.9);
        }

        .skeuo-primary-btn,
        .skeuo-secondary-btn,
        .skeuo-back-btn,
        .skeuo-mini-btn {
          transition: all .15s ease;
        }

        .skeuo-primary-btn:hover,
        .skeuo-secondary-btn:hover,
        .skeuo-back-btn:hover,
        .skeuo-mini-btn:hover {
          transform: translateY(-2px);
        }

        .skeuo-primary-btn:active,
        .skeuo-secondary-btn:active,
        .skeuo-back-btn:active,
        .skeuo-mini-btn:active {
          transform: translateY(2px);
          box-shadow:
            inset 4px 4px 8px rgba(0,0,0,0.25);
        }

        .disabled-btn {
          opacity:0.5;
          cursor:not-allowed;
          box-shadow:none !important;
        }

        .modal-overlay {
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.4);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:1000;
        }

        .modal-box {
          width:400px;
        }

        .progress-wrapper {
          display:flex;
          justify-content:center;
          margin:35px 0 20px;
        }

        .water-circle {
          width:170px;
          height:170px;
          border-radius:50%;
          position:relative;
          overflow:hidden;
          background:rgba(255,255,255,0.4);
          box-shadow:
            inset 0 8px 18px rgba(0,0,0,0.12),
            0 12px 28px rgba(0,0,0,0.15);
        }

        .water {
          position:absolute;
          bottom:0;
          width:100%;
          background:linear-gradient(180deg,#6366f1,#4f46e5);
          transition: height 0.8s ease;
          overflow:hidden;
        }

        .wave {
          position:absolute;
          top:-18px;
          left:0;
          width:200%;
          height:36px;
          background:rgba(255,255,255,0.35);
          border-radius:40%;
          animation: waveMove 5s linear infinite;
        }

        .wave2 {
          opacity:.4;
          animation-duration:7s;
        }

        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .progress-text {
          position:absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          font-weight:900;
          font-size:20px;
        }
      `}</style>
    </div>
  );
}