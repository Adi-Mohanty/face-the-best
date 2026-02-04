import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuestionRenderer from "../components/questions/QuestionRenderer";

export default function Review() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate("/exams");
    return null;
  }

  const { questions, answers } = state;
  const [currentIndex, setCurrentIndex] = useState(0);

  const question = questions[currentIndex];
  const userAnswer = answers[question.id];
  const isCorrect = userAnswer === question.correctOption;
  const totalQuestions = questions.length;

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
    if (answers[q.id] === undefined) return "unattempted";
    if (answers[q.id] === q.correctOption) return "correct";
    return "incorrect";
  };

    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-[#0f0f1a] dark:text-white">
  
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-[#e9e9f2] bg-white dark:bg-background-dark dark:border-white/10 px-4 md:px-10 lg:px-40 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight">
                Face The Best
              </h2>
            </div>
  
            <div className="flex flex-1 justify-end items-center gap-8">
              <nav className="hidden md:flex items-center gap-9">
                <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                  Dashboard
                </a>
                <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                  My Exams
                </a>
                <a className="text-sm font-medium text-primary" href="#">
                  Performance
                </a>
                <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                  Study Material
                </a>
              </nav>
  
              <div className="flex items-center gap-4">
                <button className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all">
                  Profile
                </button>
  
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-[#e9e9f2]"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuSiELC0UWRJJXZQNK3hI6x-Htv3EAtZIiKj2a9cYo0q3iO53nebmDxqpeQjFPqJtJCKiJ8TKuwlPsD5gqVw-WSMILE9GEBKsJvwd6ckM0Ts1K2r04BnpPLFuisKjn8Pvqy1jOTdISYiYhlFtjw6lo_syDdCdCJW0BNVXh_IQ9sZG7YEWSicktcwoRKr4cDG6iVhtIokkMfuCTipB_jwxi58FNCP1kTGKETWLKOOT3HkBnIfAJpBytrFLkcO6NQxKpPFczE2UXWUwM")',
                  }}
                />
              </div>
            </div>
          </div>
        </header>
  
        <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
  
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 py-2">
            <a className="text-[#555591] dark:text-gray-400 text-sm font-medium hover:underline" href="#">
              UPSC CSE 2024
            </a>
            <span className="text-[#555591] dark:text-gray-400 text-sm font-medium">
              /
            </span>
            <a className="text-[#555591] dark:text-gray-400 text-sm font-medium hover:underline" href="#">
              Mock 1
            </a>
            <span className="text-[#555591] dark:text-gray-400 text-sm font-medium">
              /
            </span>
            <span className="text-[#0f0f1a] dark:text-white text-sm font-medium">
              General Studies - I
            </span>
          </div>
  
          <div className="flex flex-col lg:flex-row gap-6 mt-4">
  
            {/* Left Side */}
            <div className="flex-1 flex flex-col gap-6">
  
              {/* Page Heading & Status */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-[#d2d2e5] dark:border-white/10">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      Question {currentIndex + 1} of {totalQuestions}
                    </h1>
                    <p className="text-[#555591] dark:text-gray-400 text-sm font-normal">
                      Subject:{" "}
                      <span className="font-medium text-[#0f0f1a] dark:text-white">
                        Indian Polity &amp; Governance
                      </span>
                    </p>
                  </div>
  
                  <div className="flex flex-col items-end gap-2">
                    {/* <span className="px-3 py-1 rounded-full bg-error-bg text-error-border text-sm font-bold border border-error-border flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                      Incorrect
                    </span> */}

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold border flex items-center gap-1 ${
                        isCorrect
                          ? "bg-success-bg text-success-border border-success-border"
                          : userAnswer === undefined
                          ? "bg-gray-100 text-gray-500 border-gray-300"
                          : "bg-error-bg text-error-border border-error-border"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isCorrect ? "check" : userAnswer === undefined ? "help" : "close"}
                      </span>
                      {isCorrect
                        ? "Correct"
                        : userAnswer === undefined
                        ? "Unattempted"
                        : "Incorrect"}
                    </span>

                    <button onClick={() => navigate(-1)} className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_back
                      </span>
                      Back to Result Summary
                    </button>
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
                  <p className="text-2xl font-bold">1m 45s</p>
                </div>
  
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900 border border-[#d2d2e5] dark:border-white/10">
                  <div className="flex items-center gap-2 text-[#555591] dark:text-gray-400">
                    <span className="material-symbols-outlined text-[20px]">
                      groups
                    </span>
                    <p className="text-sm font-medium">Avg. Time</p>
                  </div>
                  <p className="text-2xl font-bold">1m 12s</p>
                </div>
  
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900 border border-[#d2d2e5] dark:border-white/10">
                  <div className="flex items-center gap-2 text-[#555591] dark:text-gray-400">
                    <span className="material-symbols-outlined text-[20px]">
                      trending_up
                    </span>
                    <p className="text-sm font-medium">Difficulty</p>
                  </div>
                  <p className="text-2xl font-bold">Medium</p>
                </div>
              </div>
  
              {/* Question Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-[#d2d2e5] dark:border-white/10 overflow-hidden">
                <div className="p-8">
                  <QuestionRenderer
                    question={question}
                    userAnswer={answers[question.id]}
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
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 px-10 lg:px-40 border-t border-[#e9e9f2] dark:border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[#555591] dark:text-gray-400">
            <span className="font-bold text-lg">
              Face The Best
            </span>
            <span className="text-sm">
              © 2024 Face The Best. All rights reserved.
            </span>
          </div>

          <div className="flex gap-6">
            <a className="text-sm font-medium text-[#555591] dark:text-gray-400 hover:text-primary" href="#">
              Help Center
            </a>
            <a className="text-sm font-medium text-[#555591] dark:text-gray-400 hover:text-primary" href="#">
              Terms of Service
            </a>
            <a className="text-sm font-medium text-[#555591] dark:text-gray-400 hover:text-primary" href="#">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
  