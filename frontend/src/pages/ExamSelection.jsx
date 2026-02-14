import { useNavigate } from "react-router-dom";
import ExamCategorySection from "../components/ExamCategorySection";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function ExamSelection() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);

  /* 🔹 Fetch exams */
  useEffect(() => {
    const loadExams = async () => {
      const snap = await getDocs(collection(db, "exams"));
      setExams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    loadExams();
  }, []);

  /* 🔹 Category split */
  const basicExams = exams.filter(e => e.category === "basic");
  const preGradExams = exams.filter(e => e.category === "pre-grad");
  const postGradExams = exams.filter(e => e.category === "post-grad");

  /* Exam click */
  const handleExamClick = (exam) => {
    localStorage.setItem("selectedExam", JSON.stringify(exam));
    navigate("/subjects");
  };

    return (
      <div className="bg-background-light dark:bg-background-dark text-[#0f0f1a] dark:text-white min-h-screen flex flex-col font-display">
        {/* Main Content */}
        <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-12">
          {/* Page Heading */}
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#0f0f1a] dark:text-white mb-4">Choose Your Exam</h2>
            <p className="text-lg text-[#555591] dark:text-gray-400">Select your target exam to customize your preparation journey and unlock specialized resources.</p>
          </div>
  
          {/* Exam Selection Grid */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-24">
            <div className="group relative flex flex-col bg-white dark:bg-[#1a1a2e] p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer card-selected ring-1 ring-primary">
              <div className="absolute top-4 right-4 text-primary">
                <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
              </div>
              <div className="mb-6 w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">account_balance</span>
              </div>
              <h3 className="text-lg font-bold text-[#0f0f1a] dark:text-white mb-2">Banking</h3>
              <p className="text-sm text-[#555591] dark:text-gray-400 mb-4">IBPS PO, SBI Clerk, RBI Grade B</p>
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">120+ Active Tests</span>
              </div>
            </div>
  
            <div className="group relative flex flex-col bg-white dark:bg-[#1a1a2e] p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-2 border-transparent">
              <div className="mb-6 w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#555591] dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">groups</span>
              </div>
              <h3 className="text-lg font-bold text-[#0f0f1a] dark:text-white mb-2">SSC</h3>
              <p className="text-sm text-[#555591] dark:text-gray-400 mb-4">CGL, CHSL, MTS, Selection Post</p>
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-[#555591] dark:text-gray-400 uppercase tracking-wider">85+ Active Tests</span>
              </div>
            </div>
  
            <div className="group relative flex flex-col bg-white dark:bg-[#1a1a2e] p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-2 border-transparent">
              <div className="mb-6 w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#555591] dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">engineering</span>
              </div>
              <h3 className="text-lg font-bold text-[#0f0f1a] dark:text-white mb-2">Engineering</h3>
              <p className="text-sm text-[#555591] dark:text-gray-400 mb-4">GATE, ESE, State AE/JE Exams</p>
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-[#555591] dark:text-gray-400 uppercase tracking-wider">150+ Active Tests</span>
              </div>
            </div>
  
            <div className="group relative flex flex-col bg-white dark:bg-[#1a1a2e] p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-2 border-transparent">
              <div className="mb-6 w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#555591] dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">medical_services</span>
              </div>
              <h3 className="text-lg font-bold text-[#0f0f1a] dark:text-white mb-2">Medical</h3>
              <p className="text-sm text-[#555591] dark:text-gray-400 mb-4">NEET PG, FMGE, INI-CET, MDS</p>
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-[#555591] dark:text-gray-400 uppercase tracking-wider">90+ Active Tests</span>
              </div>
            </div>
  
            <div className="group relative flex flex-col bg-white dark:bg-[#1a1a2e] p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-2 border-transparent">
              <div className="mb-6 w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#555591] dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">policy</span>
              </div>
              <h3 className="text-lg font-bold text-[#0f0f1a] dark:text-white mb-2">Civil Services</h3>
              <p className="text-sm text-[#555591] dark:text-gray-400 mb-4">UPSC Civil Services, State PSC</p>
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-[#555591] dark:text-gray-400 uppercase tracking-wider">45+ Active Tests</span>
              </div>
            </div>
          </div> */}

          <ExamCategorySection
            title="Foundation Exams"
            description="Build strong basics and aptitude skills"
            exams={basicExams}
            onExamClick={handleExamClick}
          />

          <ExamCategorySection
            title="Undergraduate Entrance Exams"
            description="Competitive exams after Class 12"
            exams={preGradExams}
            onExamClick={handleExamClick}
          />

          <ExamCategorySection
            title="Advanced & Government Exams"
            description="High-level professional & govt exams"
            exams={postGradExams}
            onExamClick={handleExamClick}
          />
        </main>
  
        <style jsx>{`
          .card-selected {
            border: 2px solid #1e1e8a;
            background-color: rgba(30, 30, 138, 0.05);
          }
        `}</style>
      </div>
    );
  }
  