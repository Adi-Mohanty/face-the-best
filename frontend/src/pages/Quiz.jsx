import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockQuestions } from "../data/mockQuestions";

const STORAGE_KEY = "exam-progress";

export default function Quiz() {
    const navigate = useNavigate();
  
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [skipped, setSkipped] = useState(new Set());
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [isSubmitted, setIsSubmitted] = useState(false);
  
    const question = mockQuestions[currentIndex];
    const totalQuestions = mockQuestions.length;
  
    /* ---------------- TIMER ---------------- */
    useEffect(() => {
      if (timeLeft <= 0) {
        handleSubmit();
        return;
      }
  
      const interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
  
      return () => clearInterval(interval);
    }, [timeLeft]);

    useEffect(() => {
        // Do not persist after submission
        if (timeLeft <= 0) return;
      
        const payload = {
          currentIndex,
          answers,
          skipped: Array.from(skipped),
          markedForReview: Array.from(markedForReview),
          timeLeft
        };
      
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }, [
        currentIndex,
        answers,
        skipped,
        markedForReview,
        timeLeft
    ]);
      
    
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
      
        try {
          const data = JSON.parse(saved);
      
          setCurrentIndex(data.currentIndex ?? 0);
          setAnswers(data.answers ?? {});
          setSkipped(new Set(data.skipped ?? []));
          setMarkedForReview(new Set(data.markedForReview ?? []));
          setTimeLeft(data.timeLeft ?? 600);
        } catch (err) {
          console.error("Failed to restore exam progress", err);
          localStorage.removeItem(STORAGE_KEY);
        }
    }, []);
           
  
    const formatTime = (s) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec.toString().padStart(2, "0")}`;
    };
  
    /* ---------------- ANSWERS ---------------- */
    const handleSelect = (optionIndex) => {
      setAnswers(prev => ({
        ...prev,
        [question.id]: optionIndex
      }));
  
      setSkipped(prev => {
        const copy = new Set(prev);
        copy.delete(question.id);
        return copy;
      });
    };
  
    /* ---------------- NAVIGATION ---------------- */
    const handleNext = () => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(i => i + 1);
      }
    };
  
    const handlePrevious = () => {
      if (currentIndex > 0) {
        setCurrentIndex(i => i - 1);
      }
    };
  
    const handleSkip = () => {
      setSkipped(prev => new Set(prev).add(question.id));
      handleNext();
    };

    const handleMarkForReview = () => {
        setMarkedForReview(prev => {
          const copy = new Set(prev);
          if (copy.has(question.id)) {
            copy.delete(question.id); // toggle off
          } else {
            copy.add(question.id);
          }
          return copy;
        });
      
        // Move to next question automatically (standard exam behavior)
        handleNext();
      };
      
  
    const jumpToQuestion = (index) => {
      setCurrentIndex(index);
    };
  
    /* ---------------- STATUS ---------------- */
    const getStatus = (q, index) => {
        if (index === currentIndex) return "current";
        if (markedForReview.has(q.id)) return "marked";
        if (answers[q.id] !== undefined) return "answered";
        if (skipped.has(q.id)) return "skipped";
        return "notVisited";
    };      
  
    /* ---------------- SCORE ---------------- */
    const calculateScore = () => {
      let score = 0;
      mockQuestions.forEach(q => {
        if (answers[q.id] === q.correctOption) score++;
      });
      return score;
    };
  
    const handleSubmit = () => {
        if (isSubmitted) return; // prevents double submit

        setIsSubmitted(true);
        localStorage.removeItem(STORAGE_KEY);
      
        navigate("/result", {
          state: {
            answers,
            skipped: Array.from(skipped),
            markedForReview: Array.from(markedForReview),
            score: calculateScore(),
            questions: mockQuestions
          }
        });
      };           
  
    /* ---------------- PROGRESS ---------------- */
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round(
      (answeredCount / totalQuestions) * 100
    );
     
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">

        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-tight">
                ExamArena - Mock Test
              </h2>
            </div>
  
            <div className="flex items-center gap-6">
              {/* Countdown Timer */}
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-100 dark:border-red-800">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">
                  timer
                </span>
                <span className="text-red-600 dark:text-red-400 font-bold text-lg tabular-nums">
                {formatTime(timeLeft)}
                </span>
              </div>
  
              {/* Progress Counter */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Progress
                </span>
                <span className="text-slate-900 dark:text-slate-100 font-bold">
                {currentIndex + 1} / {totalQuestions}
                </span>
              </div>
            </div>
          </div>
        </header>
  
        <main className="flex-1 flex max-w-[1440px] mx-auto w-full overflow-hidden">
  
          {/* Left Section */}
          <div className="flex-1 flex flex-col p-8 overflow-y-auto">
  
            {/* Progress Bar */}
            <div className="mb-8 max-w-3xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Completion
                </span>
                <span className="text-sm font-bold text-primary dark:text-blue-400">
                {progressPercent}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
  
            {/* Question Area */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary dark:text-blue-400 rounded text-xs font-bold uppercase mb-4 tracking-wider">
                Reasoning &amp; Logic
              </div>
  
              <h1 className="text-2xl font-bold mb-6">Question {currentIndex + 1}</h1>
  
              <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200 mb-8">
              {question.question}
              </p>
  
              {/* Options */}
              <div className="space-y-4">
            {question.options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center p-5 border-2 rounded-xl cursor-pointer ${
                  answers[question.id] === i
                    ? "border-primary bg-primary/5"
                    : "border-slate-200"
                }`}
              >
                <input
                type="radio"
                name={`q-${question.id}`}
                checked={answers[question.id] === i}
                onChange={() => handleSelect(i)}
                disabled={isSubmitted} 
                className={isSubmitted ? "opacity-50 cursor-not-allowed" : ""}
                />

                <span className="ml-4">{opt}</span>
              </label>
            ))}
          </div>
            </div>
          </div>
  
          {/* Right Sidebar */}
          <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6">
                Question Palette
              </h3>
  
              <div className="grid grid-cols-5 gap-3">
              {mockQuestions.map((q, i) => {
              const status = getStatus(q, i);
              const base =
                "aspect-square rounded-lg font-bold text-sm";

                const map = {
                    answered: "bg-emerald-500 text-white",
                    marked: "bg-purple-500 text-white",
                    skipped: "bg-amber-400 text-white",
                    current: "bg-primary text-white",
                    notVisited: "bg-slate-100 text-slate-400"
                };
                  

              return (
                <button
                  key={q.id}
                  onClick={() => jumpToQuestion(i)}
                  className={`${base} ${map[status]}`}
                >
                  {i + 1}
                </button>
              );
            })}
              </div>
  
              {/* Legend */}
              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Status Legend
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-4 bg-emerald-500 rounded-sm" />
                  <span className="text-sm">Answered</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-4 bg-primary rounded-sm" />
                  <span className="text-sm">Current Question</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-4 bg-amber-400 rounded-sm" />
                  <span className="text-sm">Skipped</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-4 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                  <span className="text-sm">Not Visited</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-4 bg-purple-500 rounded-sm" />
                  <span className="text-sm">Marked for Review</span>
                </div>

              </div>
            </div>
  
            {/* Profile */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-200 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl0FnxN7s0PqzqTV4UITWkVhwiiwSRnAA2HYzODRlqKdvEIyx72_9lXGqmpSLCEg2B94fKmPtNLWTf0BfeDwOMoERK-IMtIAFnNCyyNvtjMMP_sU_sPwA3q3GZBqdDwtKRTNMCw2f32H3JftqAjm3LYU801m5qOV3yDq9tuxAcWkhSKTFgxYww-qrlth71hHvIOX8MIOW-CO8rPPGaFdi7E_e2Cs-YBy1c6n-KkXO6hUbFoWDBOd7jfJhOAEd_qmeu1SVbsInSlwmI"
                    alt="Candidate profile"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold truncate">Arjun Sharma</p>
                  <p className="text-xs text-slate-500">ID: EXAM-4429</p>
                </div>
              </div>
            </div>
          </aside>
        </main>
  
        {/* Footer */}
        <footer className="h-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="max-w-[1440px] mx-auto h-full px-8 flex items-center justify-between">
            <div className="flex gap-4">
              <button className={`px-6 h-11 rounded-lg border font-bold flex items-center ${
                markedForReview.has(question.id)
                    ? "border-purple-500 text-purple-600"
                    : ""
                }
                ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isSubmitted}
                onClick={handleMarkForReview}>
                <span className="material-symbols-outlined mr-2">bookmark</span>
                Mark for Review
              </button>
              
              <button className={`px-6 h-11 rounded-lg border font-bold ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isSubmitted} onClick={handleSkip}>
                Skip Question
              </button>
            </div>
  
            <div className="flex gap-4">
              <button className={`px-6 h-11 rounded-lg border font-bold ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isSubmitted} onClick={handlePrevious}>
                Previous
              </button>

              {currentIndex === totalQuestions - 1 ? (
                <button
                  className="px-8 h-11 rounded-lg bg-primary text-white font-bold flex items-center"
                  onClick={handleSubmit}
                >
                  Submit Exam
                  <span className="material-symbols-outlined ml-2">
                    check_circle
                  </span>
                </button>
              ) : (
                <button
                  className={`px-6 h-11 rounded-lg border font-bold ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isSubmitted}
                  onClick={handleNext}
                >
                  Next
                  <span className="material-symbols-outlined ml-2">
                    arrow_forward
                  </span>
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    );
  }
  