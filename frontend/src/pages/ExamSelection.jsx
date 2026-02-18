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
          <div className="mb-10 text-center max-w-xl mx-auto">
            <h2 className="
              text-3xl md:text-4xl
              font-bold
              tracking-tight
              text-[#0f0f1a] dark:text-white
              mb-2
            ">
              Choose Your Exam
            </h2>

            <p className="
              text-sm
              text-[#6a6a9a]
              dark:text-gray-400
            ">
              Select your target exam to customize your preparation journey.
            </p>
          </div>

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
  