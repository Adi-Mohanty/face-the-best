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

export default function Admin() {
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

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      console.log("Auth state:", user);
      setAuthReady(true);
    });
    return unsub;
  }, []); 

  const createJob = httpsCallable(functions, "createGenerationJob");
  const filteredSubjects = exam? subjects.filter(sub => exam.subjects?.includes(sub.id)): [];
  const progress = job
  ? Math.round((job.batchesCompleted / job.batchesTotal) * 100)
  : 0;

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
  
        if (data?.status === "COMPLETED" || data?.status === "FAILED") {
          setTimeout(() => setActiveJobId(null), 1000);
        }
      }
    );
  
    return unsub;
  }, [activeJobId]);    
  
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

  // const handleGenerate = async () => {
  //   if (!exam || !subject || !type || !count) {
  //     setError("Please fill all required fields");
  //     return;
  //   }

  //   console.log("Current user:", auth.currentUser);
  //   console.log("ID token:", await auth.currentUser?.getIdToken());

  //   if (!authReady) {
  //     setError("Auth not ready yet. Please wait 1 second and try again.");
  //     return;
  //   }

  //   if (!auth.currentUser) {
  //     setError("Not logged in");
  //     return;
  //   }
  
  //   setLoading(true);
  //   setError("");
  //   setResult(null);
  
  //   try {
  //     await auth.currentUser.getIdToken(true);

  //     const res = await generateQuestions({
  //       exam: exam.type,
  //       subject,
  //       type,
  //       count,
  //       difficulty
  //     });

  //     console.log("Generated Questions: ", res.data);
  
  //     setResult(res.data);
  //   } catch (err) {
  //     console.error(err);
  //     setError(err.message || "Generation failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
   
    return (
      <div className="bg-background-light dark:bg-background-dark font-display">
        <div className="flex h-screen overflow-hidden">
  
          {/* SideNavBar */}
          <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark flex flex-col justify-between p-4">
            <div className="flex flex-col gap-8">

            <button
              onClick={async () => {
                await signOut(auth);
                window.location.href = "/login";
              }}
            >
              Force Logout
            </button>
  
              <div className="flex items-center gap-3 px-2">
                <div className="bg-primary rounded-lg p-2 text-white">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-[#0f0f1a] dark:text-white text-lg font-bold leading-tight tracking-tight">
                    Face The Best
                  </h1>
                  <p className="text-[#555591] dark:text-gray-400 text-xs font-medium">
                    Admin Panel
                  </p>
                </div>
              </div>
  
              <nav className="flex flex-col gap-1">
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">dashboard</span>
                  <p className="text-sm font-medium">Dashboard</p>
                </a>
  
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-colors"
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    description
                  </span>
                  <p className="text-sm font-semibold">Questions</p>
                </a>
  
                <Link
                  to="/admin/exams"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                  <p className="text-sm font-medium">Exams</p>
                </Link>

                <Link
                  to="/admin/subjects"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                  <p className="text-sm font-medium">Subjects</p>
                </Link>
  
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">group</span>
                  <p className="text-sm font-medium">Users</p>
                </a>
  
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[22px]">settings</span>
                    <p className="text-sm font-medium">Settings</p>
                  </a>
                </div>
              </nav>
            </div>
  
            <div className="p-2">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div
                  className="w-8 h-8 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFQS_R_JB0c7SU-oWtORT2rtPZTy8LquXqOLsStFS0YPv0SX7wjRqOMUu3Jcn0Ui4MXSPPFpBnBlWf5_oaeQuHlW_1uNhoa05GprMoLuvNJdnClH5uvKJ-yJb82q6e0fhe1mi_AaUEeF9jFGrcWXnTZOrJYIO5YnsW7wXDPTrfayIQyKN5IA4nL3LepWDapbYj3LO7DR2sRwEuan4qSHhyC4OrAuZDVDoFWOkw9fC8d2afvBUQCpTq92-yuZnUNgCcnsFi3nflAw9G')",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    Admin Account
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    admin@examarena.in
                  </p>
                </div>
              </div>
            </div>
          </aside>
  
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
            <div className="max-w-[1000px] mx-auto px-8 py-10">
  
              {/* Page Heading */}
              <div className="mb-8">
                <h2 className="text-[#0f0f1a] dark:text-white text-3xl font-black leading-tight tracking-tight">
                  Generate Questions
                </h2>
                <p className="text-[#555591] dark:text-gray-400 text-base font-normal mt-1">
                  Configure parameters to populate the question bank with AI-driven content.
                </p>
              </div>
  
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-7">
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <div className="space-y-6">
                    {/* Target Exam */}
                    <div>
                      <label className="block mb-2 text-[#0f0f1a] dark:text-gray-200 text-sm font-semibold">
                        Target Exam
                      </label>
                      <div className="relative custom-select">
                        <select
                          value={exam?.id || ""}
                          onChange={(e) => {
                            const selected = exams.find(ex => ex.id === e.target.value);
                            setExam(selected);
                            setSubject("");
                          }}
                          className="appearance-none w-full px-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0f0f1a] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        >
                          <option value="" disabled>Select Exam...</option>

                          {exams.map(ex => (
                            <option key={ex.id} value={ex.id}>
                              {ex.type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block mb-2 text-[#0f0f1a] dark:text-gray-200 text-sm font-semibold">
                        Subject
                      </label>
                      <div className="relative custom-select">
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          disabled={!exam}
                          className="appearance-none w-full px-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0f0f1a] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        >
                          <option value="" disabled>
                            {exam ? "Select Subject..." : "Select exam first"}
                          </option>

                          {filteredSubjects.map(sub => (  
                            <option key={sub.id} value={sub.name}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Question Type */}
                    <div>
                      <label className="block mb-2 text-sm font-semibold">
                        Question Type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="appearance-none w-full px-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0f0f1a] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                      >
                        <option value="" disabled>Select Question Type...</option>
                        <option value="MCQ">MCQ</option>
                        <option value="STATEMENT">Statement Based</option>
                        <option value="ASSERTION_REASON">Assertion–Reason</option>
                        <option value="PASSAGE">Passage Based</option>
                      </select>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block mb-2 text-[#0f0f1a] dark:text-gray-200 text-sm font-semibold">
                        Number of Questions
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={1}
                          max={30}
                          defaultValue={10}
                          value={count}
                          onChange={(e) => setCount(Number(e.target.value))}
                          className="w-full px-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0f0f1a] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        />
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          Max: 30 per batch
                        </p>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block mb-2 text-[#0f0f1a] dark:text-gray-200 text-sm font-semibold">
                        Difficulty Level
                      </label>
                      <div className="flex gap-2">
                        {["Easy", "Medium", "Hard"].map(level => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setDifficulty(level)}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all
                              ${
                                difficulty === level
                                  ? "border-2 border-primary bg-primary/5 text-primary"
                                  : "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary"
                              }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <button onClick={handleGenerate}
                        disabled={loading || job?.status === "RUNNING"}
                        className="w-full bg-primary hover:bg-[#15156b] text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined">bolt</span>
                          {loading ? "Generating..." : "Generate Questions"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Card */}
              <div className="lg:col-span-5">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="h-40 bg-primary/10 relative flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-6xl text-primary opacity-20">
                      psychology
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-[#0f0f1a] dark:text-white text-lg font-bold mb-2">
                      Generation Statistics
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Total Questions Generated
                        </span>
                        <span className="text-sm font-bold">12,402</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Available Credits
                        </span>
                        <span className="text-sm font-bold text-primary">
                          4,850
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Last Batch Status
                        </span>
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Complete
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">
                          info
                        </span>
                        <p className="text-xs text-[#555591] dark:text-gray-300 leading-relaxed">
                          Automated generation uses our high-performance AI model.
                          Each batch takes approximately 30–60 seconds to process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Snackbar */}
      {result && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-white border-l-4 border-green-500 shadow-xl rounded-lg p-4 flex gap-4">
            <span className="material-symbols-outlined text-green-600">
              check_circle
            </span>
            <div>
              <p className="font-bold text-sm">Generation Complete</p>
              <p className="text-xs text-gray-500">
                Approved: {result.approved}, Rejected: {result.rejected}
              </p>
            </div>
          </div>
        </div>
      )}

      {job && (
        <GenerationJobModal
          job={job}
          onClose={() => setJob(null)}
        />
      )}

    </div>
  );
}