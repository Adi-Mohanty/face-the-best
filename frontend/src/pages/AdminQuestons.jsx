import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";
import { useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import GenerationJobModal from "../components/GenerationJobModal";

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

export default function AdminQuestions() {
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

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      console.log("Auth state:", user);
      setAuthReady(true);
    });
    return unsub;
  }, []); 

  const createJob = httpsCallable(functions, "createGenerationJob");
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
        setJob(data);

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
          if (!j.subject || !j.generated) return;
          subjectMap[j.subject] = (subjectMap[j.subject] || 0) + j.generated;
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
      collection(db, "questions"),
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
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            Question Generation Console
          </h2>
  
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate and manage AI-powered questions for exams
          </p>
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
  
              {/* Count */}
              <Field label="Number of Questions">
                <input
                  type="number"
                  value={count}
                  onChange={e =>
                    setCount(Number(e.target.value))
                  }
                  className="skeuo-input"
                />
              </Field>
  
              {/* Difficulty */}
              <Field label="Difficulty">
                <div className="flex gap-2">
                  {["Easy", "Medium", "Hard"].map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
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
  
              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={loading || job?.status === "RUNNING"}
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
  
              <div className="grid grid-cols-2 gap-4">
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
                    <button
                      key={j.id}
                      onClick={() => setJob(j)}
                      className="skeuo-job-card"
                    >
                      <div>
                        <p className="text-xs font-bold">
                          {j.exam} • {j.subject}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          {j.approved}/{j.generated} approved • {j.type}
                        </p>
                      </div>
  
                      <span
                        className={`status-badge
                          ${j.status === "RUNNING" ? "status-running" :
                            j.status === "COMPLETED" ? "status-completed" :
                            j.status === "FAILED" ? "status-failed" :
                            j.status === "PARTIAL" ? "status-partial" : ""}`}
                      >
                        {j.status}
                      </span>
                    </button>  
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
          job={job}
          onClose={() => setJob(null)}
        />
      )}
  
  
  
      {/* Skeuomorphic Styles */}
      <style jsx>{`

      /* ================= GLASS CARD ================= */
      .skeuo-card {
        border-radius: 22px;
        padding: 22px;

        background: rgba(255,255,255,0.55);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);

        border: 1px solid rgba(255,255,255,0.4);

        box-shadow:
          0 10px 30px rgba(0,0,0,0.08),
          inset 0 1px 0 rgba(255,255,255,0.6);
      }


      /* ================= INPUT ================= */
      .skeuo-input {
        width:100%;
        padding:12px 14px;
        border-radius:14px;
        border:1px solid rgba(0,0,0,0.05);
        font-size:14px;

        background: rgba(255,255,255,0.7);

        box-shadow:
          inset 0 2px 4px rgba(0,0,0,0.05);

        transition: all .2s ease;
      }

      .skeuo-input:focus {
        outline:none;
        border-color:#6366f1;
        box-shadow:
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

        background: linear-gradient(135deg,#4f46e5,#6366f1);
        color:white;
        font-weight:700;

        box-shadow:
          0 8px 18px rgba(79,70,229,0.35);

        transition: all .2s ease;
      }

      .skeuo-primary-btn:hover {
        transform: translateY(-2px);
        box-shadow:
          0 12px 25px rgba(79,70,229,0.4);
      }

      .skeuo-primary-btn:active {
        transform: translateY(0);
      }

      .skeuo-primary-btn:disabled {
        opacity:.6;
        cursor:not-allowed;
      }


      /* ================= CHIPS ================= */
      .skeuo-chip {
        flex:1;
        padding:10px;
        font-size:12px;
        font-weight:600;
        border-radius:14px;
        border:1px solid rgba(0,0,0,0.05);

        background: rgba(255,255,255,0.6);
        backdrop-filter: blur(10px);

        transition: all .2s ease;
      }

      .skeuo-chip:hover {
        background: rgba(255,255,255,0.85);
      }

      .skeuo-chip.active {
        background: linear-gradient(135deg,#4f46e5,#6366f1);
        color:white;
        box-shadow:
          0 6px 14px rgba(79,70,229,0.35);
      }


      /* ================= STAT TILE ================= */
      .stat-tile {
        border-radius:16px;
        padding:18px;

        background: rgba(255,255,255,0.65);
        backdrop-filter: blur(12px);

        box-shadow:
          0 6px 18px rgba(0,0,0,0.06);
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

        background: rgba(255,255,255,0.65);
        backdrop-filter: blur(12px);

        display:flex;
        justify-content:space-between;
        align-items:center;

        box-shadow:
          0 6px 18px rgba(0,0,0,0.06);

        transition: all .2s ease;
      }

      .skeuo-job-card:hover {
        transform: translateY(-2px);
        box-shadow:
          0 12px 24px rgba(0,0,0,0.08);
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

      `}</style>
  
    </div>
  );
}