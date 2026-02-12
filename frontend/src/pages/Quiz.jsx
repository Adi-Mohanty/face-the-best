import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchQuestions } from "../services/questions";
import QuestionRenderer from "../components/questions/QuestionRenderer";
import { auth } from "../services/firebase";
import InstructionsModal from "../components/Instructions";
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

const STORAGE_KEY = "exam-progress";
const TOTAL_TIME = 600;

export default function Quiz() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { exam, subject } = state || {};
    
    useEffect(() => {
      if (!exam || !subject) {
        navigate("/exams");
      }
    }, [exam, subject, navigate]);
      
    const [phase, setPhase] = useState("loading");
    // loading | noQuestions | instructions | exam

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [skipped, setSkipped] = useState(new Set());
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [responses, setResponses] = useState({});
    const [showSubmitWarning, setShowSubmitWarning] = useState(false);

    const question = questions[currentIndex];
    // console.log("question :", question);
    const totalQuestions = questions.length;
    const [quizStartTime] = useState(Date.now());
    const submitAttempt = httpsCallable(functions, "submitAttempt");

    useEffect(() => {
      console.log("Current user:", auth.currentUser);
    }, []); 

    useEffect(() => {
      const load = async () => {
        try {
          const data = await fetchQuestions(exam.type, subject.name, 10);
    
          if (data.length < 10) {
            setPhase("noQuestions");
            return;
          }
    
          setQuestions(data);
          setPhase("instructions");
        } catch (e) {
          console.error(e);
          setPhase("noQuestions");
        } finally {
          // setLoading(false);
        }
      };
    
      load();
    }, [exam, subject]);    
  
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
      recordResponse({
        questionId: question.id,
        selectedOption: optionIndex,
        skipped: false,
        markedForReview: markedForReview.has(question.id)
      });
    
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
    const goToQuestion = (index) => {
      if (index < 0 || index >= totalQuestions) return;
      // console.log("index: ", index);
      setQuestionStartTime(Date.now());
      setCurrentIndex(index);
    };

    const goNext = () => {
      if (currentIndex < totalQuestions - 1) {
        goToQuestion(currentIndex + 1);
      }
    };
    
    const goPrev = () => {
      if (currentIndex > 0) {
        goToQuestion(currentIndex - 1);
      }
    };
  
    const handleSkip = () => {
      recordResponse({
        questionId: question.id,
        selectedOption: null,
        skipped: true,
        markedForReview: false
      });
    
      setSkipped(prev => new Set(prev).add(question.id));
      
      if (currentIndex === totalQuestions - 1) {
        // 🚀 Auto-submit if last question
        handleSubmitClick();
      } else {
        goToQuestion(currentIndex + 1);
      }
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

        if (answers[question.id] === undefined) {
          recordResponse({
            questionId: question.id,
            selectedOption: null,
            skipped: true,
            markedForReview: true
          });
        }        
      
        // Move to next question automatically (standard exam behavior)
        if (currentIndex < totalQuestions - 1) {
          goToQuestion(currentIndex + 1);
        }
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
    const buildFinalResponses = () => {
      return questions.map(q => {
        const r = responses[q.id];
    
        return {
          questionId: q.id,
          selectedOption: r?.selectedOption ?? null,
          skipped: r?.skipped ?? true,
          markedForReview: r?.markedForReview ?? false,
          timeTakenMs: r?.timeTakenMs ?? 0,
          isCorrect: r?.isCorrect ?? false
        };
      });
    };

    const recordResponse = ({
      questionId,
      selectedOption,
      skipped,
      markedForReview
    }) => {
      const timeTakenMs = Math.max(
        0,
        Date.now() - questionStartTime
      );      
      const q = questions.find(q => q.id === questionId);
    
      setResponses(prev => ({
        ...prev,
        [questionId]: {
          questionId,
          selectedOption,
          skipped,
          markedForReview,
          isCorrect:
            selectedOption !== null &&
            selectedOption === q.correctOption,
          timeTakenMs
        }
      }));
    }; 
  

    const handleSubmit = async () => {
      if (isSubmitted) return;
    
      setIsSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
    
      const payload = {
        exam,
        subject,
        questions: questions.map(q => q.id),
        responses: buildFinalResponses(),
        startedAt: quizStartTime,
        finishedAt: Date.now()
      };
    
      try {
        const res = await submitAttempt(payload);
    
        navigate(`/result/${res.data.attemptId}`)       
        
      } catch (err) {
        console.error("Failed to submit attempt", err);
        setIsSubmitted(false);
      }
    };  
    
    
    const handleSubmitClick = () => {
      const unansweredCount =
        totalQuestions - Object.keys(answers).length;
    
      if (unansweredCount > 0) {
        setShowSubmitWarning(true);
        return;
      }
    
      handleSubmit();
    };
    
  
    /* ---------------- PROGRESS ---------------- */
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round(
      (answeredCount / totalQuestions) * 100
    );


    if (phase === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg font-semibold text-slate-500">
            Preparing your quiz…
          </p>
        </div>
      );
    }    
    
    if (phase === "noQuestions") {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-red-500">
            No quiz available
          </h2>
          <p className="text-gray-500 mt-2">
            Questions for this subject are not added yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 rounded-lg bg-primary text-white"
          >
            Go Back
          </button>
        </div>
      );
    }

    
     
    return (
      <>
        {/* Instructions Modal */}
        {phase === "instructions" && (
          <InstructionsModal
            onConfirm={() => setPhase("exam")}
          />
        )}

        {showSubmitWarning && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 w-[420px] shadow-2xl">
              
              <h2 className="text-xl font-bold mb-4">
                Unanswered Questions Remaining
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                You still have{" "}
                <span className="font-bold">
                  {totalQuestions - Object.keys(answers).length}
                </span>{" "}
                unanswered question(s).
                <br /><br />
                Are you sure you want to submit?
              </p>

              <div className="flex justify-end gap-4">
                <button
                  className="px-5 py-2 rounded-lg border font-semibold"
                  onClick={() => setShowSubmitWarning(false)}
                >
                  Continue Exam
                </button>

                <button
                  className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold"
                  onClick={() => {
                    setShowSubmitWarning(false);
                    handleSubmit();
                  }}
                >
                  Submit Anyway
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Quiz UI */}
        {phase === "exam" && (<div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">

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
                  Face The Best - Mock Test
                </h2>
              </div>

              <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary dark:text-blue-400 rounded text-xs font-bold uppercase tracking-wider">
                Reasoning &amp; Logic
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
                <h1 className="text-2xl font-bold mb-6">Question {currentIndex + 1}</h1>
    
                {question && (
                  <QuestionRenderer
                    question={question}
                    userAnswer={answers[question.id]}
                    onSelect={handleSelect}
                    mode="exam"
                  />
                )}
              </div>
            </div>
    
            {/* Right Sidebar */}
            <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="p-6 overflow-y-auto flex-1">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6">
                  Question Palette
                </h3>
    
                <div className="grid grid-cols-5 gap-3">
                {questions.map((q, i) => {
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
                    onClick={() => goToQuestion(i)}
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
                  markedForReview?.has(question?.id)
                      ? "border-purple-500 text-purple-600"
                      : ""
                  }
                  ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!question || isSubmitted}
                  onClick={handleMarkForReview}>
                  <span className="material-symbols-outlined mr-2">bookmark</span>
                  Mark for Review
                </button>
                
                <button className={`px-6 h-11 rounded-lg border font-bold ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isSubmitted} onClick={handleSkip}>
                  Skip Question
                </button>
              </div>
    
              <div className="flex gap-4">
                <button className={`px-6 h-11 rounded-lg border font-bold ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isSubmitted} onClick={goPrev}>
                  Previous
                </button>

                {currentIndex === totalQuestions - 1 ? (
                  <button
                    className="px-8 h-11 rounded-lg bg-primary text-white font-bold flex items-center"
                    onClick={handleSubmitClick}
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
                    onClick={goNext}
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
        </div>)}
      </>
    );
  }
  