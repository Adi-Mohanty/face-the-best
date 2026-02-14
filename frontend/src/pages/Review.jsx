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
        <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
  
            {/* Left Side */}
            <div className="flex-1 flex flex-col gap-6">
  
              {/* Page Heading & Status */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-[#d2d2e5] dark:border-white/10">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-2xl font-bold tracking-tight">
                      Question {currentIndex + 1} of {totalQuestions}
                    </h1>

                    <p className="text-[#555591] dark:text-gray-400 text-sm font-normal">
                      Exam:{" "}
                      <span className="font-medium text-[#0f0f1a] dark:text-white">
                        {attempt.examType || "—"}
                      </span>
                    </p>

                    <p className="text-[#555591] dark:text-gray-400 text-sm font-normal">
                      Subject:{" "}
                      <span className="font-medium text-[#0f0f1a] dark:text-white">
                        {attempt.subjectName || "—"}
                      </span>
                    </p>
                  </div>
  
                  <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold border flex items-center gap-1 ${
                      isSkipped
                        ? "bg-gray-100 text-gray-500 border-gray-300"
                        : isCorrect
                        ? "bg-success-bg text-success-border border-success-border"
                        : "bg-error-bg text-error-border border-error-border"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isSkipped ? "remove" : isCorrect ? "check" : "close"}
                    </span>

                    {isSkipped
                      ? "Skipped"
                      : isCorrect
                      ? "Correct"
                      : "Incorrect"
                    }
                  </span>
                  </div>
                </div>
              </div>
  
              {/* Stats Bar */}
              <div className="flex flex-wrap gap-4">
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900 border border-[#d2d2e5] dark:border-white/10">
                  <div className="flex items-center gap-2 text-[#555591] dark:text-gray-400">
                    <span className="material-symbols-outlined text-[20px]">
                      timer
                    </span>
                    <p className="text-sm font-medium">Your Time</p>
                  </div>
                  <p className="text-xl font-bold">
                    {response
                    ? `${Math.round(response.timeTakenMs / 1000)}s`
                    : "—"}
                  </p>
                </div>
  
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900 border border-[#d2d2e5] dark:border-white/10">
                  <div className="flex items-center gap-2 text-[#555591] dark:text-gray-400">
                    <span className="material-symbols-outlined text-[20px]">
                      groups
                    </span>
                    <p className="text-sm font-medium">Avg. Time</p>
                  </div>
                  <p className="text-xl font-bold">
                    {Math.round(attempt.result.avgTimeMs / 1000)}s
                  </p>
                </div>
  
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900 border">
                  <div className="flex items-center gap-2 text-[#555591]">
                    <span className="material-symbols-outlined">psychology</span>
                    <p className="text-sm font-medium">Decision</p>
                  </div>
                  <p className="text-xl font-bold">
                    {response?.markedForReview ? "Doubtful" : "Confident"}
                  </p>
                </div>
              </div>
  
              {/* Question Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-[#d2d2e5] dark:border-white/10 overflow-hidden">
                <div className="p-8">
                  <QuestionRenderer
                    question={question}
                    userAnswer={userAnswer}
                    mode="review"
                  /> 
                </div>
              </div>
  
            {/* Bottom Navigation (Sticky behavior simulated) */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-[#d2d2e5] dark:border-white/10 flex justify-between items-center">
              <button onClick={goPrev} disabled={currentIndex === 0} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#e9e9f2] dark:bg-gray-700 text-[#0f0f1a] dark:text-white font-bold hover:bg-[#d2d2e5] transition-colors">
                <span className="material-symbols-outlined">
                  arrow_back_ios
                </span>
                Previous
              </button>

              <div className="hidden sm:flex gap-4">
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
              </div>

              <button onClick={goNext} disabled={currentIndex === totalQuestions - 1} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-opacity-90 transition-colors">
                Next
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              </button>
            </div>

          </div>

          {/* Right Sidebar: Question Palette */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-xl border border-[#d2d2e5] dark:border-white/10 p-5 flex flex-col gap-6">

              <div>
                <h4 className="text-base font-bold mb-1">
                  Question Palette
                </h4>
                <p className="text-[#555591] dark:text-gray-400 text-sm">
                  Quick Jump
                </p>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => {
                  const status = getQuestionStatus(q);

                  const colorMap = {
                    correct: "bg-success-border/20 text-success-border",
                    incorrect: "bg-error-border/20 text-error-border",
                    unattempted: "bg-gray-200 text-gray-500"
                  };

                  return (
                    <div
                      key={q.id}
                      onClick={() => jumpToQuestion(i)}
                      className={`size-10 flex items-center justify-center rounded font-bold text-sm cursor-pointer transition-colors ${
                        colorMap[status]
                      } ${i === currentIndex ? "ring-2 ring-primary" : ""}`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#d2d2e5] dark:border-white/10 pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-success-border"></div>
                  <span className="text-xs font-medium">
                    Correct
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-error-border"></div>
                  <span className="text-xs font-medium">
                    Incorrect
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-gray-300"></div>
                  <span className="text-xs font-medium">
                    Unattempted
                  </span>
                </div>
              </div>

              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 px-6 py-2 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary/10"
              >
                <span className="material-symbols-outlined">
                  arrow_back
                </span>
                Back to Result Summary
              </button>

              <button
                onClick={() => navigate("/exams")}
                className="flex items-center gap-2 px-6 py-2 rounded-lg border-2 border-primary bg-primary text-white font-bold hover:bg-primary/10"
              >
                <span className="material-symbols-outlined">
                  restart_alt
                </span>
                Take Another Quiz
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
  