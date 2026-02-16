import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionRenderer from "../components/questions/QuestionRenderer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { collection, query, where, getDocs, documentId } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Review() {
  const navigate = useNavigate();
  const { attemptId } = useParams();

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [questionDocs, setQuestionDocs] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchAttemptAndQuestions() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      const snap = await getDoc(doc(db, "attempts", attemptId));

      if (!snap.exists()) {
        navigate("/exams");
        return;
      }

      const attemptData = snap.data();

      // 🔒 OWNER VALIDATION
      if (attemptData.userId !== user.uid) {
        navigate("/exams");
        return;
      }

      setAttempt(attemptData);
  
      // 🔥 Fetch actual question documents in batches
      const questionIds = attemptData.questions;

      // Firestore "in" supports max 10 IDs per query
      const chunkSize = 10;
      const chunks = [];

      for (let i = 0; i < questionIds.length; i += chunkSize) {
        chunks.push(questionIds.slice(i, i + chunkSize));
      }

      let allQuestions = [];

      for (const chunk of chunks) {
        const q = query(
          collection(db, "questions"),
          where(documentId(), "in", chunk)
        );

        const snap = await getDocs(q);

        snap.forEach(doc => {
          allQuestions.push({
            id: doc.id,
            ...doc.data()
          });
        });
      }

      // 🔥 Preserve original order
      const orderedQuestions = questionIds.map(id =>
        allQuestions.find(q => q.id === id)
      );

      setQuestionDocs(orderedQuestions);
      setLoading(false);
    }
  
    fetchAttemptAndQuestions();
  }, [attemptId]);  

  if (loading) return <div>Loading...</div>;
  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-slate-500">
          Attempt not found.
        </p>
      </div>
    );
  }  

  const { responses } = attempt;
  const questions = questionDocs;

  const responseMap = Object.fromEntries(
    responses.map(r => [r.questionId, r])
  );

  const question = questions[currentIndex];
  if (!question) return null;

  const response = responseMap[question.id];

  const userAnswer = response?.selectedOption;
  const isCorrect = response?.isCorrect;
  const totalQuestions = questions.length;
  const isSkipped = response?.selectedOption === null;

  const goNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(i => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentIndex(index);
  };

  const getQuestionStatus = (q) => {
    const r = responseMap[q.id];
    if (!r || r.selectedOption === null) return "unattempted";
    return r.isCorrect ? "correct" : "incorrect";
  };    

    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-[#0f0f1a] dark:text-white">
        <main className="max-w-[1120px] mx-auto px-6 py-5">
         <div className="flex flex-col lg:flex-row gap-5 items-start">
  
            {/* Left Side */}
            <div className="flex-1 flex flex-col gap-6">
  
              {/* Page Heading & Status */}
              <div className="
                rounded-2xl px-5 py-4
                bg-gradient-to-b from-white to-slate-200
                border border-slate-300
                shadow-[8px_8px_16px_rgba(0,0,0,0.06),_-6px_-6px_12px_rgba(255,255,255,0.9)]
              ">
                <div className="flex justify-between items-start">

                  <div>
                    <h1 className="text-xl font-bold">
                      Question {currentIndex + 1}
                      <span className="text-slate-400 text-sm font-medium">
                        {" "}of {totalQuestions}
                      </span>
                    </h1>

                    <p className="text-xs text-slate-500 mt-1">
                      {attempt.examType} • {attempt.subjectName}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1
                    border
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]
                    ${
                      isSkipped
                        ? "bg-gradient-to-b from-white to-slate-200 border-slate-300 text-slate-500"
                        : isCorrect
                        ? "bg-gradient-to-b from-emerald-100 to-emerald-200 border-emerald-400 text-emerald-700"
                        : "bg-gradient-to-b from-red-100 to-red-200 border-red-400 text-red-700"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isSkipped ? "remove" : isCorrect ? "check" : "close"}
                    </span>
                    {isSkipped ? "Skipped" : isCorrect ? "Correct" : "Incorrect"}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {[{
                  icon: "timer",
                  label: "Your Time",
                  value: response ? `${Math.round(response.timeTakenMs/1000)}s` : "—"
                },{
                  icon: "groups",
                  label: "Avg Time",
                  value: `${Math.round(attempt.result.avgTimeMs/1000)}s`
                },{
                  icon: "psychology",
                  label: "Decision",
                  value: response?.markedForReview ? "Doubtful" : "Confident"
                }].map((item, i) => (
                  <div key={i}
                    className="
                    flex-1 rounded-xl px-4 py-4
                    bg-gradient-to-b from-white to-slate-200
                    border border-slate-300
                    shadow-[6px_6px_12px_rgba(0,0,0,0.06),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                    text-sm
                  ">
                    <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide">
                      <span className="material-symbols-outlined text-base">
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                    <p className="text-lg font-bold mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

  
              {/* Question Card */}
              <div className="
                rounded-2xl px-6 py-6
                bg-gradient-to-b from-white to-slate-200
                border border-slate-300
                shadow-[10px_10px_20px_rgba(0,0,0,0.08),_-8px_-8px_16px_rgba(255,255,255,0.9)]
              ">
                <QuestionRenderer
                  question={question}
                  userAnswer={userAnswer}
                  mode="review"
                />
              </div>

  
            {/* Bottom Navigation (Sticky behavior simulated) */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-[#d2d2e5] dark:border-white/10 flex justify-between items-center">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="
                flex items-center gap-2 px-5 py-2 text-sm font-semibold
                rounded-xl
                bg-gradient-to-b from-white to-slate-200
                border border-slate-300
                shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                transition-all duration-150
                active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15)]
                active:translate-y-[2px]
                disabled:opacity-40
              ">
                  <span className="material-symbols-outlined">
                  arrow_back_ios
                </span>
                Previous
              </button>

              {/* <div className="hidden sm:flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-primary font-bold hover:bg-primary/10">
                  <span className="material-symbols-outlined">
                    bookmark_add
                  </span>
                  Save
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-primary font-bold hover:bg-primary/10">
                  <span className="material-symbols-outlined">
                    flag
                  </span>
                  Report
                </button>
              </div> */}

              <button
                onClick={goNext} 
                disabled={currentIndex === totalQuestions - 1}
                className="
                flex items-center gap-2 px-5 py-2 text-sm font-semibold
                rounded-xl
                bg-gradient-to-b from-primary to-blue-600
                text-white
                shadow-[6px_6px_12px_rgba(0,0,0,0.2)]
                border border-slate-300
                transition-all duration-150
                active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15)]
                active:translate-y-[2px]
                disabled:opacity-40
              ">
                Next
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              </button>
            </div>

          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 sticky top-20 self-start">

            {/* Skeuomorphic Control Panel */}
            <div
              className="
                rounded-2xl px-5 py-5
                bg-gradient-to-b from-white to-slate-200
                border border-slate-300
                shadow-[10px_10px_20px_rgba(0,0,0,0.08),_-8px_-8px_16px_rgba(255,255,255,0.95)]
                flex flex-col gap-6
              "
            >

              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-600 tracking-wide uppercase">
                  Question Palette
                </h4>

                <span className="text-xs font-semibold text-slate-400">
                  {currentIndex + 1} / {questions.length}
                </span>
              </div>

              {/* Palette Grid */}
              <div className="grid grid-cols-5 gap-2">

                {questions.map((q, i) => {
                  const status = getQuestionStatus(q);

                  return (
                    <div
                      key={q.id}
                      onClick={() => jumpToQuestion(i)}
                      className={`
                        w-9 h-9
                        text-xs font-bold
                        flex items-center justify-center
                        rounded-lg
                        border
                        cursor-pointer
                        transition-all duration-150

                        ${
                          status === "correct"
                            ? `
                            bg-gradient-to-b from-emerald-200 to-emerald-300
                            border-emerald-500
                            shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2)]
                            text-emerald-800
                            `
                            : status === "incorrect"
                            ? `
                            bg-gradient-to-b from-red-200 to-red-300
                            border-red-500
                            shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2)]
                            text-red-800
                            `
                            : `
                            bg-gradient-to-b from-white to-slate-200
                            border-slate-300
                            shadow-[4px_4px_8px_rgba(0,0,0,0.08),_-3px_-3px_6px_rgba(255,255,255,0.95)]
                            text-slate-600
                            `
                        }

                        ${
                          i === currentIndex
                            ? `
                            ring-2 ring-primary
                            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.25)]
                            `
                            : ""
                        }

                        active:translate-y-[1px]
                        active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.25)]
                      `}
                    >
                      {i + 1}
                    </div>
                  );
                })}

              </div>


              {/* Legend */}
              <div className="
                pt-4
                border-t border-slate-300
                flex flex-col gap-2 text-xs font-medium text-slate-600
              ">

                <div className="flex items-center gap-2">

                  <div className="
                    w-3 h-3 rounded-full
                    bg-gradient-to-b from-emerald-300 to-emerald-400
                    border border-emerald-500
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
                  "></div>

                  Correct
                </div>

                <div className="flex items-center gap-2">

                  <div className="
                    w-3 h-3 rounded-full
                    bg-gradient-to-b from-red-300 to-red-400
                    border border-red-500
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
                  "></div>

                  Incorrect
                </div>

                <div className="flex items-center gap-2">

                  <div className="
                    w-3 h-3 rounded-full
                    bg-gradient-to-b from-white to-slate-200
                    border border-slate-400
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]
                  "></div>

                  Unattempted
                </div>

              </div>


              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">

                {/* Back Button */}
                <button
                  onClick={() => navigate(-1)}
                  className="
                  flex items-center justify-center gap-2
                  px-4 py-2.5
                  text-sm font-semibold
                  rounded-xl

                  bg-gradient-to-b from-white to-slate-200
                  border border-slate-300

                  shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_8px_rgba(255,255,255,0.95)]

                  transition-all duration-150

                  active:translate-y-[2px]
                  active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]
                "
                >
                  <span className="material-symbols-outlined text-base">
                    arrow_back
                  </span>

                  Back to Results
                </button>


                {/* Primary Button */}
                <button
                  onClick={() => navigate("/exams")}
                  className="
                  flex items-center justify-center gap-2
                  px-4 py-2.5
                  text-sm font-semibold
                  rounded-xl

                  bg-gradient-to-b from-primary to-blue-600
                  border border-blue-700
                  text-white

                  shadow-[6px_6px_14px_rgba(0,0,0,0.25)]

                  transition-all duration-150

                  active:translate-y-[2px]
                  active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.35)]
                "
                >
                  <span className="material-symbols-outlined text-base">
                    restart_alt
                  </span>

                  Take Another Quiz
                </button>

              </div>

            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}
  