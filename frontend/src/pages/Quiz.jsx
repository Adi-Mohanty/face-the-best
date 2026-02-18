import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchQuestions } from "../services/questions";
import QuestionRenderer from "../components/questions/QuestionRenderer";
import { auth } from "../services/firebase";
import InstructionsModal from "../components/quiz/Instructions";
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";
import MechanicalStopwatch from "../components/quiz/MechanicalStopwatch";

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
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [responses, setResponses] = useState({});
    const [showSubmitWarning, setShowSubmitWarning] = useState(false);
    const [quizStartTime, setQuizStartTime] = useState(null);

    const question = questions[currentIndex];
    // console.log("question :", question);
    const totalQuestions = questions.length;
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
      if (phase !== "exam") return;
    
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmit();
            return 0;
          }
    
          return prev - 1;
        });
      }, 1000);
    
      return () => clearInterval(interval);
    }, [phase]);    

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
        startedAt: quizStartTime ?? Date.now(),
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

    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / TOTAL_TIME;
    const offset = circumference * (1 - progress);
     
    return (
      <>
        {/* Instructions Modal */}
        {phase === "instructions" && (
          <InstructionsModal
            onConfirm={() => {
              setQuizStartTime(Date.now());
              setQuestionStartTime(Date.now());
              setPhase("exam");
            }}
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
        {phase === "exam" && (
          <div className="max-w-[1400px] mx-auto px-6 py-8">

            <div className="flex gap-8">

              {/* ================= LEFT MAIN AREA ================= */}
              <div className="flex-1 space-y-6">

                {/* Exam Info */}
                <div className="bg-white dark:bg-slate-900 rounded-xl px-6 py-4 
                                shadow-[6px_6px_14px_rgba(0,0,0,0.06),_-4px_-4px_10px_rgba(255,255,255,0.6)]
                                border border-slate-200 dark:border-slate-800">

                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
                    {exam?.type} • {subject?.name} • QUIZ
                  </p>

                  <h1 className="text-xl font-bold">
                    Question {currentIndex + 1}
                  </h1>
                </div>

                {/* Question Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6
                                shadow-[8px_8px_18px_rgba(0,0,0,0.08),_-6px_-6px_14px_rgba(255,255,255,0.7)]
                                border border-slate-200 dark:border-slate-800">

                  {question && (
                    <QuestionRenderer
                      question={question}
                      userAnswer={answers[question.id]}
                      onSelect={handleSelect}
                      mode="exam"
                    />
                  )}
                </div>

                {/* Bottom Controls */}
                <div className="flex justify-between items-center">

                  <div className="flex gap-3">
                    <button
                      className="px-5 py-2 text-sm font-semibold rounded-xl
                      bg-gradient-to-b from-white to-slate-200
                      shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                      border border-slate-300
                      transition-all duration-150
                      active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]
                      active:translate-y-[2px]"
           
                      onClick={handleMarkForReview}
                    >
                      Mark
                    </button>

                    <button
                      className="px-5 py-2 text-sm font-semibold rounded-xl
                      bg-gradient-to-b from-white to-slate-200
                      shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                      border border-slate-300
                      transition-all duration-150
                      active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]
                      active:translate-y-[2px]"
           
                      onClick={handleSkip}
                    >
                      Skip
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="px-5 py-2 text-sm font-semibold rounded-xl
                      bg-gradient-to-b from-white to-slate-200
                      shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                      border border-slate-300
                      transition-all duration-150
                      active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]
                      active:translate-y-[2px]"
           
                      onClick={goPrev}
                    >
                      Previous
                    </button>

                    {currentIndex === totalQuestions - 1 ? (
                      <button
                      className="px-6 py-2 text-sm font-semibold rounded-xl
                      bg-gradient-to-b from-primary to-blue-600
                      text-white
                      shadow-[6px_6px_12px_rgba(0,0,0,0.2)]
                      transition-all duration-150
                      active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)]
                      active:translate-y-[2px]"
           
                        onClick={handleSubmitClick}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                      className="px-5 py-2 text-sm font-semibold rounded-xl
                      bg-gradient-to-b from-white to-slate-200
                      shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                      border border-slate-300
                      transition-all duration-150
                      active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]
                      active:translate-y-[2px]"
           
                        onClick={goNext}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= RIGHT SIDEBAR ================= */}
              <aside className="w-80 space-y-6">

                {/* Timer & Progress */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4
                shadow-[6px_6px_14px_rgba(0,0,0,0.06),_-4px_-4px_10px_rgba(255,255,255,0.6)]
                border border-slate-200 dark:border-slate-800">

                  <div className="flex gap-4">
                    {/* TIMER */}
                    <MechanicalStopwatch
                      timeLeft={timeLeft}
                      totalTime={TOTAL_TIME}
                    />

                    {/* PROGRESS */}
                    <div className="flex-1 bg-[#f4f6f9] dark:bg-slate-900 rounded-2xl p-4
                    shadow-[6px_6px_14px_rgba(0,0,0,0.06),_-4px_-4px_10px_rgba(255,255,255,0.6)]
                    border border-slate-200 dark:border-slate-800
                    text-center flex items-center justify-center flex-col">

                      <p className="text-base font-bold">
                        {currentIndex + 1} / {totalQuestions}
                      </p>

                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
                        Progress
                      </p>
                    </div>
                  </div>
                </div>

                {/* Question Palette */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5
                                shadow-[6px_6px_14px_rgba(0,0,0,0.06),_-4px_-4px_10px_rgba(255,255,255,0.6)]
                                border border-slate-200 dark:border-slate-800">

                  <h3 className="text-sm font-semibold mb-4">
                    Question Palette
                  </h3>

                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, i) => {
                      const status = getStatus(q, i);

                      const map = {
                        answered: "bg-emerald-500 text-white shadow-inner",
                        marked: "bg-purple-500 text-white shadow-inner",
                        skipped: "bg-amber-400 text-white shadow-inner",
                        current: "bg-primary text-white",
                        notVisited: "bg-slate-200 text-slate-500"
                      };

                      return (
                        <button
                          key={q.id}
                          onClick={() => goToQuestion(i)}
                          className={`h-9 rounded-lg text-xs font-semibold
                            border border-slate-300
                            transition-all duration-150
                            ${
                              status === "notVisited"
                                ? "bg-gradient-to-b from-white to-slate-200 shadow-[4px_4px_8px_rgba(0,0,0,0.08),_-3px_-3px_6px_rgba(255,255,255,0.9)]"
                                : map[status]
                            }
                            active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15)]
                            active:translate-y-[1px]`}                          
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-4 border-t border-slate-200 text-xs space-y-2">

                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-emerald-500 shadow-inner"></div>
                      <span>Answered</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-purple-500 shadow-inner"></div>
                      <span>Marked</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-amber-400 shadow-inner"></div>
                      <span>Skipped</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-slate-300 shadow-inner"></div>
                      <span>Not Visited</span>
                    </div>

                  </div>
                </div>
              </aside>

            </div>
          </div>
        )}  
      </>
    );
  }