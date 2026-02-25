import { auth } from "../../services/firebase";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../services/firebase";
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import GenerationJobModal from "../../components/GenerationJobModal";
import ApprovedQuestionsModal from "../../components/ApprovedQuestionsModal";
import { useNavigate } from "react-router-dom";

function Field({ label, children }) {
  return (
    <div className="mb-4">

      <label className="
        block mb-1.5
        text-xs font-bold
        text-slate-700 dark:text-slate-300
      ">
        {label}
      </label>

      {children}

    </div>
  );
}

export default function GenerateQuestions() {
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState("Easy");
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);
  const [job, setJob] = useState(null);

  const [stats, setStats] = useState({
    totalQuestions: 0,
    credits: 0
  });  
  const [recentJobs, setRecentJobs] = useState([]);

  const [avgApprovalRate, setAvgApprovalRate] = useState(0);
  const [topSubjects, setTopSubjects] = useState([]);
  const [reviewJobId, setReviewJobId] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      console.log("Auth state:", user);
      setAuthReady(true);
    });
    return unsub;
  }, []); 

  const difficultyLimits = {
    Easy: 60,
    Medium: 30,
    Hard: 10
  };  

  const createJob = httpsCallable(functions, "createGenerationJob");
  const retryJob = httpsCallable(functions, "retryGenerationJob");
  const filteredSubjects = exam? subjects.filter(sub => exam.subjects?.includes(sub.id)): [];

  useEffect(() => {
    const loadMeta = async () => {
      const examsSnap = await getDocs(collection(db, "exams"));
      const subjectsSnap = await getDocs(collection(db, "subjects"));
  
      setExams(examsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setSubjects(subjectsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
  
    loadMeta();
  }, []); 
  
  useEffect(() => {
    if (!activeJobId) return;
  
    const unsub = onSnapshot(
      doc(db, "generationJobs", activeJobId),
      (snap) => {
        const data = snap.data();
        setJob({ id: snap.id, ...data });

        if (data?.status === "COMPLETED") {
          setExam(null);
          setSubject("");
          setType("");
          setCount(10);
          setDifficulty("Easy");
        }
  
        if (data?.status === "COMPLETED" || data?.status === "FAILED") {
          setTimeout(() => setActiveJobId(null), 1000);
        }
      }
    );
  
    return unsub;
  }, [activeJobId]);   
  
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "generationJobs"),
      (snap) => {
        const jobs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
  
        // 🔹 Recent 5 jobs (UI list)
        setRecentJobs(jobs.slice(0, 5));
  
        // 🔹 Last 10 completed/partial jobs for analytics
        const last10 = jobs
          .filter(j => j.status === "COMPLETED" || j.status === "PARTIAL")
          .slice(0, 10);
  
        // ===== Average Approval Rate =====
        if (last10.length > 0) {
          const totalApproved = last10.reduce((s, j) => s + (j.approved || 0), 0);
          const totalGenerated = last10.reduce((s, j) => s + (j.generated || 0), 0);
  
          const rate = totalGenerated
            ? Math.round((totalApproved / totalGenerated) * 100)
            : 0;
  
          setAvgApprovalRate(rate);
        } else {
          setAvgApprovalRate(0);
        }
  
        // ===== Top 3 Most Generated Subjects =====
        const subjectMap = {};
  
        jobs.forEach(j => {
          if (!j.subject || !j.approved) return;
          subjectMap[j.subject] = (subjectMap[j.subject] || 0) + j.approved;
        });
  
        const top = Object.entries(subjectMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([subject, count]) => ({ subject, count }));
  
        setTopSubjects(top);
      }
    );
  
    return unsub;
  }, []);    

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "questions"),
        where("pipelineVersion", "==", 2),
        where("isActive", "==", true)
      ),
      (snap) => {
        setStats(prev => ({
          ...prev,
          totalQuestions: snap.size
        }));
      }
    );
  
    return unsub;
  }, []);  
  
  const handleGenerate = async () => {
    if (recentJobs.some(j => j.status === "RUNNING")) {
      setError("A generation job is already running.");
      return;
    }    

    setLoading(true);
    setError("");
  
    try {
      const res = await createJob({
        exam: exam.type,
        subject,
        type,
        count,
        difficulty
      });
  
      setActiveJobId(res.data.jobId);
    } catch (e) {
      setError("Failed to start generation");
    } finally {
      setLoading(false);
    }
  };

  function StatTile({ label, value }) {
    return (
      <div className="stat-tile">
        <p>{label}</p>
        <p>{value}</p>
      </div>
    );
  }


  return (
    <div className="
      min-h-screen font-display
      bg-gradient-to-br
      from-slate-100 via-slate-50 to-slate-200
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
    ">
      <main className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              Question Generation Console
            </h2>
    
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Generate and manage AI-powered questions for exams
            </p>
          </div>

          <button
              onClick={() => navigate("/admin/questions")}
              className="skeuo-back-btn"
            >
              ← Back
          </button>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — GENERATION FORM */}
          <div className="lg:col-span-7">
            <div className="skeuo-card p-5">
              {/* Target Exam */}
              <Field label="Target Exam">
                <select
                  value={exam?.id || ""}
                  onChange={(e) => {
                    const selected = exams.find(
                      ex => ex.id === e.target.value
                    );
                    setExam(selected);
                    setSubject("");
                  }}
                  className="skeuo-input"
                >
                  <option value="">Select exam</option>
                  {exams.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.type}
                    </option>
                  ))}
                </select>
              </Field>
  
              {/* Subject */}
              <Field label="Subject">
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  disabled={!exam}
                  className="skeuo-input"
                >
                  <option value="">
                    {exam
                      ? "Select subject"
                      : "Select exam first"}
                  </option>
  
                  {filteredSubjects.map(sub => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </Field>
  
              {/* Question Type */}
              <Field label="Question Type">
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="skeuo-input"
                >
                  <option value="">Select type</option>
                  <option value="MCQ">MCQ</option>
                  <option value="STATEMENT">Statement</option>
                  <option value="ASSERTION_REASON">Assertion-Reason</option>
                  <option value="PASSAGE">Passage</option>
                </select>
              </Field>

              {/* Difficulty */}
              <Field label="Difficulty">
                <div className="flex gap-2">
                  {["Easy", "Medium", "Hard"].map(level => (
                    <button
                      key={level}
                      onClick={() => {
                        setDifficulty(level);
                        const max = difficultyLimits[level];
                        if (count > max) setCount(max);
                      }}                      
                      className={`
                        skeuo-chip
                        ${difficulty === level
                          ? "active"
                          : ""}
                      `}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </Field>
  
              {/* Count */}
              <Field label="Number of Questions">
              <input
                type="number"
                value={count}
                min={1}
                max={difficultyLimits[difficulty]}
                onChange={e => {
                  const value = Number(e.target.value);
                  const max = difficultyLimits[difficulty];
                  setCount(Math.min(value, max));
                }}
                className="skeuo-input"
              />
              </Field>
              <p className="text-[11px] text-slate-500 mt-1">
                Max allowed for {difficulty}: {difficultyLimits[difficulty]}
              </p>

  
              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={
                  loading ||
                  job?.status === "RUNNING" ||
                  !exam ||
                  !subject ||
                  !type ||
                  count < 1
                }                
                className="skeuo-primary-btn mt-3"
              >
                <span className="material-symbols-outlined text-lg">
                  bolt
                </span>
  
                {loading
                  ? "Generating..."
                  : "Generate Questions"}
              </button>
            </div>
          </div>
  
          {/* RIGHT — STATS */}
          <div className="lg:col-span-5">
            <div className="skeuo-card p-5">
              <h3 className="font-bold mb-4">
                Statistics
              </h3>
  
              <div className="grid grid-cols-3 gap-4">
                <StatTile
                  label="Total Questions"
                  value={stats.totalQuestions}
                  accent="primary"
                />
  
                <StatTile
                  label="Approval Rate"
                  value={`${avgApprovalRate}%`}
                  accent="green"
                />

                <StatTile
                  label="Rejection Rate"
                  value={`${100 - avgApprovalRate}%`}
                />
              </div>
  
              {/* Top Subjects */}
              <div className="mt-5">
                <h4 className="font-bold mb-2 text-sm">
                  Top Subjects
                </h4>
  
                <div className="space-y-2">
                  {topSubjects.map((s, i) => (
                    <div key={s.subject}>
                      <div className="flex justify-between text-xs">
                        <span>
                          #{i + 1} {s.subject}
                        </span>
  
                        <span className="text-primary font-bold">
                          {s.count}
                        </span>
                      </div>
  
                      <div className="skeuo-progress">
                        <div
                          style={{
                            width: `${
                              (s.count /
                                topSubjects[0]?.count) *
                              100
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Recent Jobs */}
              <div className="mt-5">
  
                <h4 className="font-bold mb-2 text-sm">
                  Recent Jobs
                </h4>
  
                <div className="space-y-2">
                  {recentJobs.map(j => (
                    <div key={j.id} className="skeuo-job-card">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setJob(j)}
                      >
                        <p className="text-xs font-bold">
                          {j.exam} • {j.subject}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          {j.approved}/{j.generated} approved • {j.type}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`status-badge
                            ${j.status === "RUNNING" ? "status-running" :
                              j.status === "COMPLETED" ? "status-completed" :
                              j.status === "FAILED" ? "status-failed" :
                              j.status === "PARTIAL" ? "status-partial" : ""}`}
                        >
                          {j.status}
                        </span>

                        {(j.status === "FAILED" || j.status === "PARTIAL") && (
                          <button
                            onClick={async () => {
                              setActiveJobId(j.id);
                              await retryJob({ jobId: j.id });
                            }}
                            className="retry-btn"
                          >
                            ↻
                          </button>
                        )}
                      </div>
                    </div>

                  ))}
                </div>
              </div>
            </div>
          </div>
        </div> 
      </main>

  
      {/* Modal */}
      {job && (
        <GenerationJobModal
          job={{
            ...job,
            onReview: (jobId) => setReviewJobId(jobId)
          }}
          onClose={() => setJob(null)}
        />
      )}

      {reviewJobId && (
        <ApprovedQuestionsModal
          jobId={reviewJobId}
          onClose={() => setReviewJobId(null)}
        />
      )}
  
  
      {/* Skeuomorphic Styles */}
      <style jsx>{`

      /* ================= GLASS CARD ================= */
      .skeuo-card {
        border-radius: 22px;
        padding: 22px;
        background: linear-gradient(145deg, #ffffff, #e8edf5);
        border: 1px solid #e5e7eb;

        box-shadow:
          10px 10px 20px rgba(0,0,0,0.08),
          -6px -6px 14px rgba(255,255,255,0.9);
      }


      /* ================= INPUT ================= */
      .skeuo-input {
        width:100%;
        padding:12px 14px;
        border-radius:14px;
        font-size:14px;
        background: #f4f6f9;
        border:1px solid #e2e8f0;
        box-shadow:
          inset 4px 4px 8px rgba(0,0,0,0.05),
          inset -4px -4px 8px rgba(255,255,255,0.9);
        transition: all .2s ease;
      }

      .skeuo-input:focus {
        outline:none;
        box-shadow:
          inset 3px 3px 6px rgba(0,0,0,0.08),
          inset -3px -3px 6px rgba(255,255,255,0.8),
          0 0 0 3px rgba(99,102,241,0.15);
      }


      /* ================= PRIMARY BUTTON ================= */
      .skeuo-primary-btn {
        width:100%;
        display:flex;
        justify-content:center;
        align-items:center;
        gap:8px;
        padding:14px;
        border-radius:16px;
        border:none;

        background: linear-gradient(to bottom, #6366f1, #4f46e5);
        color:white;
        font-weight:700;

        box-shadow:
          0 8px 18px rgba(79,70,229,0.35);

        transition: all .15s ease;
      }

      .skeuo-primary-btn:hover {
        transform: translateY(-2px);
        box-shadow:
          0 12px 25px rgba(79,70,229,0.4);
      }

      .skeuo-primary-btn:active {
        box-shadow:
          inset 4px 4px 8px rgba(0,0,0,0.25);
        transform: translateY(2px);
      }

      .skeuo-primary-btn:disabled {
        opacity:.6;
        cursor:not-allowed;
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
        transition: all .15s ease;
      }

      .skeuo-back-btn:hover {
        transform: translateY(-2px);
      }

      .skeuo-back-btn:active {
        transform: translateY(2px);
        box-shadow:
          inset 4px 4px 8px rgba(0,0,0,0.25);
      }


      /* ================= CHIPS ================= */
      .skeuo-chip {
        flex:1;
        padding:10px;
        font-size:12px;
        font-weight:600;
        border-radius:14px;
        border:1px solid #e5e7eb;

        background: linear-gradient(145deg, #ffffff, #e8edf5);

        transition: all .15s ease;
      }

      .skeuo-chip.active {
        background: linear-gradient(to bottom, #6366f1, #4f46e5);
        color:white;
        box-shadow:
          inset 4px 4px 8px rgba(0,0,0,0.2);
      }


      /* ================= STAT TILE ================= */
      .stat-tile {
        border-radius:18px;
        padding:18px;

        background: linear-gradient(145deg, #ffffff, #e6ebf2);

        box-shadow:
          6px 6px 14px rgba(0,0,0,0.08),
          -4px -4px 10px rgba(255,255,255,0.9);

        text-align:center;
      }

      .stat-tile p:first-child {
        font-size:11px;
        color:#64748b;
        margin-bottom:6px;
      }

      .stat-tile p:last-child {
        font-size:24px;
        font-weight:900;
        color:#1e293b;
      }


      /* ================= PROGRESS ================= */
      .skeuo-progress {
        height:8px;
        margin-top:6px;
        border-radius:999px;
        background: rgba(0,0,0,0.05);
        overflow:hidden;
      }

      .skeuo-progress div {
        height:100%;
        background: linear-gradient(90deg,#4f46e5,#6366f1);
        border-radius:999px;
      }


      /* ================= JOB CARD ================= */
      .skeuo-job-card {
        width:100%;
        padding:14px;
        border-radius:18px;

        background: linear-gradient(145deg, #ffffff, #e8edf5);

        display:flex;
        justify-content:space-between;
        align-items:center;

        box-shadow:
          6px 6px 14px rgba(0,0,0,0.08),
          -4px -4px 10px rgba(255,255,255,0.9);

        border: 1px solid #e5e7eb;

        transition: all .2s ease;
      }

      .skeuo-job-card:hover {
        transform: translateY(-2px);
      }


      /* ================= STATUS BADGES ================= */
      .status-badge {
        font-size:11px;
        font-weight:700;
        padding:5px 10px;
        border-radius:999px;
      }

      .status-running {
        background:rgba(59,130,246,0.15);
        color:#2563eb;
      }

      .status-completed {
        background:rgba(16,185,129,0.15);
        color:#059669;
      }

      .status-failed {
        background:rgba(239,68,68,0.15);
        color:#dc2626;
      }

      .status-partial {
        background:rgba(234,179,8,0.15);
        color:#ca8a04;
      }

      .retry-btn {
        font-size:12px;
        padding:6px 8px;
        border-radius:10px;
        border:none;
        background: rgba(99,102,241,0.15);
        color:#4f46e5;
        font-weight:700;
        transition:.2s;
      }

      .retry-btn:hover {
        background: rgba(99,102,241,0.25);
      }

      `}</style>
  
    </div>
  );
}