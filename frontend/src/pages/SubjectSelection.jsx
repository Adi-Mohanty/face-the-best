import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import SubjectActionModal from "../components/SubjectActionModal";

export default function SubjectSelection() {
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null);

  /* Load selected exam */
  useEffect(() => {
    const stored = localStorage.getItem("selectedExam");
    if (!stored) {
      navigate("/exams");
      return;
    }
    setExam(JSON.parse(stored));
  }, [navigate]);

  /* Load subjects for exam */
  useEffect(() => {
    if (!exam) return;

    const loadSubjects = async () => {
      const snap = await getDocs(collection(db, "subjects"));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // exam.subjects contains subject IDs
      const filtered = all.filter(s => exam.subjects.includes(s.id));
      setSubjects(filtered);
    };

    loadSubjects();
  }, [exam]);

  const totalSubjects = subjects.length;
  const practicedCount = 0; // TODO: replace with user progress data


  if (!exam) return null;
    
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#0f0f1a] dark:text-white transition-colors duration-200">
  
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white dark:bg-background-dark border-b border-solid border-[#e9e9f2] dark:border-gray-800">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <div className="size-8 text-primary">
                <svg
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
                </svg>
              </div>
              <h1 className="text-[#0f0f1a] dark:text-white text-xl font-bold leading-tight tracking-tight">
                Face The Best
              </h1>
            </div>
  
            <nav className="hidden md:flex items-center gap-9">
              <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                Exams
              </a>
              <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                Results
              </a>
              <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                Dashboard
              </a>
              <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                Support
              </a>
            </nav>
  
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#e9e9f2] dark:bg-gray-800 text-[#0f0f1a] dark:text-white hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
  
              <div
                className="h-10 w-10 rounded-full bg-cover bg-center border border-gray-200"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCO4ZUPIJqUwUP3SRT-9ng0gvP3KLyn8YFyE3NwR7qYeDW6BMLHrJ7JzTkkR77jp5ZVTsgzrnpjx6clP7mOYPXEQDKTXbBThCroTCmVhPnI8HPWtlSE8KyrwYGxIqGIAFYPoYByEDS6pZEu3k0nPrnL95RceVRtfF7OrEabVvI2CaagjQNovrPcNHNsh5aX7NqC_TZ6sEbXm-DCoSChi3C8tRFiMl7Ix6fwIR3Ibi73GXSrFI46OUL7sCDCVkG9FjgjE5G8lXS0o9wo")',
                }}
              />
            </div>
          </div>
        </header>
  
        <main className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Page Heading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div className="max-w-2xl">
              <h2 className="text-[#0f0f1a] dark:text-white text-3xl md:text-3xl font-black leading-tight tracking-tight mb-3">
                {exam.type} — Choose Your Subject
              </h2>
              <p className="text-[#555591] dark:text-gray-400 text-lg">
                Select a subject to begin your personalized practice session for the current exam tier. Questions will be from selected subject only.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl
                            bg-primary/5 dark:bg-blue-900/20
                            border border-primary/20">
              <span className="material-symbols-outlined text-primary">
                insights
              </span>
              <p className="text-sm font-semibold text-[#0f0f1a] dark:text-white">
                You have practiced{" "}
                <span className="text-primary font-black">
                  {practicedCount}
                </span>{" "}
                / {totalSubjects} subjects
              </p>
            </div>
          </div>
  
          {/* Subject Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {subjects.map(subject => (
              <div
                key={subject.id}
                onClick={() => setActiveSubject(subject)}
                className="cursor-pointer group bg-white dark:bg-gray-800
                          rounded-xl overflow-hidden border
                          hover:border-primary hover:shadow-xl
                          transition-all active:scale-[0.98]"
              >
                {/* DiceBear Image */}
                <img
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(subject.name)}`}
                  alt={subject.name}
                  className="h-44 w-full object-cover"
                />

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-1 rounded-lg text-primary dark:text-blue-300">
                      <span className="material-symbols-outlined">{subject.icon}</span>
                    </div>
                    <h3 className="font-bold text-lg">{subject.name}</h3>
                  </div>

                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-[#555591] dark:text-gray-400 text-sm">
                      <span className="material-symbols-outlined text-base">
                        format_list_numbered
                      </span>
                      10 Questions
                    </p>
                    <p className="flex items-center gap-2 text-[#555591] dark:text-gray-400 text-sm">
                      <span className="material-symbols-outlined text-base">
                        timer
                      </span>
                      10 Mins
                    </p>
                    <p className="text-[#555591] dark:text-gray-400 text-sm mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 italic">
                      {subject.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Action Modal */}
        {activeSubject && (
          <SubjectActionModal
            exam={exam}
            subject={activeSubject}
            onClose={() => setActiveSubject(null)}
            onStartQuiz={() => {
              navigate("/quiz", {
                state: {
                  exam,
                  subject: activeSubject
                }
              });
            }}            
          />
        )}
      </div>
    );
}