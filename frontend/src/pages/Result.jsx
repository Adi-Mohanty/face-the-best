import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../services/firebase";

export default function Result() {
  const navigate = useNavigate();
  const { attemptId } = useParams();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) {
      navigate("/exams");
      return;
    }

    const fetchAttempt = async () => {
      try {
        const snap = await getDoc(doc(db, "attempts", attemptId));

        if (!snap.exists()) {
          navigate("/exams");
          return;
        }

        setAttempt({ attemptId: snap.id, ...snap.data() }); // keep ID
      } catch (err) {
        console.error("Failed to fetch attempt", err);
        navigate("/exams");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-slate-500">
          Loading results…
        </p>
      </div>
    );
  }

  if (!attempt) return null;
  
  const { result, responses, exam, subject } = attempt;

  const {
    score,
    accuracy,
    totalTimeMs,
    avgTimeMs,
    correctCount,
    attemptedCount,
    skippedCount,
    totalQuestions
  } = result;
  
  const wrong = attemptedCount - correctCount;
  const markedCount = responses.filter(r => r.markedForReview).length;

  const attemptedPercent = Math.round(
    (attemptedCount / totalQuestions) * 100
  );
  const speedScore = Math.max(
    0,
    100 - Math.round((avgTimeMs / 1000) * 2)
  );  

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };  

  const timeEfficiencyPercent = Math.min(
    100,
    Math.round((avgTimeMs / 1000 / 60) * 100)
  );  

    return (
      <div className="bg-background-light dark:bg-background-dark text-[#0f0f1a] dark:text-white min-h-screen">
  
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white dark:bg-[#1a1a2e] border-b border-solid border-[#e9e9f2] dark:border-[#2d2d45] px-4 lg:px-40 py-3">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between whitespace-nowrap">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 text-primary dark:text-white">
                <div className="size-8 bg-primary text-white flex items-center justify-center rounded-lg">
                  <span className="material-symbols-outlined">auto_stories</span>
                </div>
                <h2 className="text-[#0f0f1a] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                  Face The Best
                </h2>
              </div>
  
              <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-[#555591] flex bg-[#e9e9f2] dark:bg-[#2d2d45] items-center justify-center pl-4 rounded-l-lg">
                    <span className="material-symbols-outlined !text-xl">
                      search
                    </span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 border-none bg-[#e9e9f2] dark:bg-[#2d2d45] dark:text-white placeholder:text-[#555591] px-4 rounded-r-lg text-base font-normal outline-none focus:ring-0"
                    placeholder="Search exams..."
                  />
                </div>
              </label>
            </div>
  
            <div className="flex flex-1 justify-end gap-8">
              <div className="hidden lg:flex items-center gap-9">
                <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                  Dashboard
                </a>
                <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                  Courses
                </a>
                <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                  Test Series
                </a>
              </div>
  
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA1_EiLoSh5FjSWWAYTIVzwG5h6w1npjIqDLiqjAA0TjDj6ixreBpXQAjoOmBhTa9sFNa99hil25DhbdheN3bxJ9NZHUTecMgTw-dWGtTgVIHddF7KxfyfFKzEh-ETZb2zbewhdhEbW2fg8mPDBoJ_-I7Qr7UeMcbTwmvKwT2cu7Gq8OjIPEnLjXaB7gZRP-MAMnhOUV1dI2BDn_XyPfjDGZwHPq5JON3xB98XLt3fn36FQS-zL5NvUUQT9eJDUYX7NgNc5f90pCB5n")',
                }}
              />
            </div>
          </div>
        </header>
  
        <main className="max-w-[1280px] mx-auto px-4 lg:px-40 py-8">
  
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
            <div className="flex min-w-72 flex-col gap-2">
              <div className="flex items-center gap-2 text-primary dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">
                  check_circle
                </span>
                Test Completed
              </div>
              <p className="text-[#0f0f1a] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Quiz Results
              </p>
              <p className="text-[#555591] dark:text-gray-400 text-base font-normal">
                {exam?.type || "—"} - {subject?.name || "—"}
              </p>
            </div>
  
            <div className="flex gap-3">
              <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-[#e9e9f2] dark:bg-[#2d2d45] text-[#0f0f1a] dark:text-white text-sm font-bold transition-all hover:bg-gray-200">
                <span className="material-symbols-outlined mr-2 text-lg">
                  share
                </span>
                Share
              </button>
              <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:opacity-90">
                <span className="material-symbols-outlined mr-2 text-lg">
                  print
                </span>
                Print Report
              </button>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
  
              {/* Score Hero Card */}
              <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-[#d2d2e5] dark:border-[#2d2d45] p-8 flex flex-col md:flex-row items-center gap-10">
                <div className="relative flex items-center justify-center">
                  <svg className="size-48 transform ">
                    <circle
                      className="text-gray-200 dark:text-gray-800"
                      cx="96"
                      cy="96"
                      r="88"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="12"
                    />
                    <circle
                      className="text-primary"
                      cx="96"
                      cy="96"
                      r="88"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray="552.92"
                      strokeDashoffset="121.64"
                    />
                  </svg>
  
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-[#0f0f1a] dark:text-white">
                      {Math.round(accuracy * 100)}%
                    </span>
                    <span className="text-xs font-bold text-[#555591] dark:text-gray-400 uppercase tracking-widest">
                      Accuracy
                    </span>
                  </div>
                </div>
  
                <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
                  <div>
                    <p className="text-[#555591] dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">
                      Your Total Score
                    </p>
                    <h3 className="text-6xl font-black text-primary dark:text-white leading-none">
                      {score}
                      <span className="text-2xl text-[#555591] dark:text-gray-500 font-normal">
                        / {totalQuestions * 1}
                      </span>
                    </h3>
                  </div>
  
                  <div className="flex items-center justify-center md:justify-start gap-2 text-[#078841] font-bold">
                    <span className="material-symbols-outlined">
                      trending_up
                    </span>
                    <span>Top 15% of all candidates</span>
                  </div>
  
                  <p className="text-[#555591] dark:text-gray-400 text-sm italic">
                    "Great job! You've shown consistent improvement in the General Studies section."
                  </p>
                </div>
              </div>
  
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1a2e] border border-[#d2d2e5] dark:border-[#2d2d45]">
                  <div className="flex justify-between items-start">
                    <p className="text-[#555591] dark:text-gray-400 text-sm font-medium">
                      Correct
                    </p>
                    <span className="material-symbols-outlined text-[#078841]">
                      check_circle
                    </span>
                  </div>
                  <p className="text-[#0f0f1a] dark:text-white text-3xl font-bold">
                      {correctCount}
                  </p>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#078841]"
                      style={{ width: `${(correctCount / totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>
  
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1a2e] border border-[#d2d2e5] dark:border-[#2d2d45]">
                  <div className="flex justify-between items-start">
                    <p className="text-[#555591] dark:text-gray-400 text-sm font-medium">
                      Wrong
                    </p>
                    <span className="material-symbols-outlined text-[#d32f2f]">
                      cancel
                    </span>
                  </div>
                  <p className="text-[#0f0f1a] dark:text-white text-3xl font-bold">
                    {wrong}
                  </p>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d32f2f]"
                      style={{ width: `${(wrong / totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>
  
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1a2e] border border-[#d2d2e5] dark:border-[#2d2d45]">
                  <div className="flex justify-between items-start">
                    <p className="text-[#555591] dark:text-gray-400 text-sm font-medium">
                      Skipped
                    </p>
                    <span className="material-symbols-outlined text-[#555591]">
                      do_not_disturb_on
                    </span>
                  </div>
                  <p className="text-[#0f0f1a] dark:text-white text-3xl font-bold">
                    {skippedCount}
                  </p>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#555591]"
                      style={{ width: `${(skippedCount / totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1a2e] border border-[#d2d2e5] dark:border-[#2d2d45]">
                  <div className="flex justify-between items-start">
                    <p className="text-[#555591] dark:text-gray-400 text-sm font-medium">
                      Marked
                    </p>
                    <span className="material-symbols-outlined text-[#555591]">
                      do_not_disturb_on
                    </span>
                  </div>
                  <p className="text-[#0f0f1a] dark:text-white text-3xl font-bold">
                    {markedCount}
                  </p>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#555591]"
                      style={{ width: `${(markedCount / totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
  
              {/* Detailed Stats */}
              <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-[#d2d2e5] dark:border-[#2d2d45] overflow-hidden">
                <div className="p-6 border-b border-[#d2d2e5] dark:border-[#2d2d45]">
                  <h4 className="text-lg font-bold">
                    Performance Breakdown
                  </h4>
                </div>
  
                <div className="p-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-6 justify-between">
                      <p className="text-[#0f0f1a] dark:text-white text-base font-medium">
                      Avg per question
                      </p>
                      <p className="text-[#0f0f1a] dark:text-white text-sm font-normal">
                        {formatTime(Math.round(avgTimeMs / 1000))}
                      </p>
                    </div>
                    <div className="rounded-full bg-[#d2d2e5] dark:bg-gray-800">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${timeEfficiencyPercent}%` }}
                      />
                    </div>
                    <p className="text-[#555591] dark:text-gray-400 text-sm">
                      You were 15% faster than the average student.
                    </p>
                  </div>
  
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-6 justify-between">
                      <p className="text-base font-medium">
                        Attempt Coverage
                      </p>
                      <p className="text-sm font-normal">
                        {attemptedPercent}%
                      </p>
                    </div>
                    <div className="rounded-full bg-[#d2d2e5] dark:bg-gray-800">
                      <div
                        className="h-2 rounded-full bg-[#078841]"
                        style={{ width: `${attemptedPercent}%` }}
                      />
                    </div>
                    <p className="text-sm text-[#555591]">
                      You attempted {attemptedCount} out of {totalQuestions} questions.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-6 justify-between">
                      <p className="text-base font-medium">
                        Speed vs Accuracy
                      </p>
                      <p className="text-sm font-normal">
                        Balanced
                      </p>
                    </div>
                    <div className="rounded-full bg-[#d2d2e5] dark:bg-gray-800">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${speedScore}%` }}
                      />
                    </div>
                    <p className="text-sm text-[#555591]">
                      Faster responses with stable accuracy improve rankings.
                    </p>
                  </div>
                </div>
              </div>
  
            </div>
          {/* Right Column */}
          <div className="flex flex-col gap-6">

            {/* Consistency Badge Card */}
            <div className="bg-gradient-to-br from-primary to-[#3a3ab8] rounded-xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-yellow-400">
                  <span className="material-symbols-outlined !text-4xl fill-1">
                    military_tech
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold leading-tight">
                    3-Day Streak!
                  </h4>
                  <p className="text-white/80 text-sm">
                    Consistency Badge Earned
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-black/10 rounded-lg p-4 mb-4">
                <div className="flex gap-2">
                  <div className="size-8 rounded-full bg-yellow-400 text-primary flex items-center justify-center font-bold text-xs italic">
                    M
                  </div>
                  <div className="size-8 rounded-full bg-yellow-400 text-primary flex items-center justify-center font-bold text-xs italic">
                    T
                  </div>
                  <div className="size-8 rounded-full bg-yellow-400 text-primary flex items-center justify-center font-bold text-xs italic">
                    W
                  </div>
                  <div className="size-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs italic">
                    T
                  </div>
                  <div className="size-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs italic">
                    F
                  </div>
                </div>

                <div className="flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-orange-400 fill-1">
                    local_fire_department
                  </span>
                  3
                </div>
              </div>

              <p className="text-sm text-center font-medium">
                Complete one more test tomorrow to unlock the "Bronze Disciplinarian" title.
              </p>
            </div>


            {/* Global Rank Stats */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-[#d2d2e5] dark:border-[#2d2d45] p-6">
              <p className="text-[#555591] dark:text-gray-400 text-sm font-medium mb-4">
                Community Comparison
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#0f0f1a] dark:text-white font-medium">
                    Global Rank
                  </span>
                  <span className="text-xl font-bold">
                    #452
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#0f0f1a] dark:text-white font-medium">
                    Percentile
                  </span>
                  <span className="text-xl font-bold">
                    94.8%
                  </span>
                </div>

                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary dark:text-blue-300 text-xs font-medium text-center">
                  You are in the top 500 aspirants this week!
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-[#d2d2e5] dark:border-[#2d2d45] p-6">
              <h4 className="text-lg font-bold mb-6">
                Next Steps
              </h4>

              <div className="flex flex-col gap-4">
                <button 
                onClick={() => navigate(`/review/${attempt.attemptId}`)} 
                className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-primary text-white font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">
                      assignment_turned_in
                    </span>
                    Review Solutions
                  </div>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>

                <button onClick={() => navigate("/exams")} className="w-full flex items-center justify-between px-5 py-4 rounded-lg border-2 border-primary text-primary dark:text-blue-400 font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">
                      restart_alt
                    </span>
                    Take Another Quiz
                  </div>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}