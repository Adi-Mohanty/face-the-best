import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../services/firebase";

export default function Result() {
  const navigate = useNavigate();
  const { attemptId } = useParams();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0);
  const [barProgress, setBarProgress] = useState({
    time: 0,
    coverage: 0,
    efficiency: 0
  });
  

  useEffect(() => {
    if (!attempt) return;
  
    const timeout = setTimeout(() => {
      setAnimatedAccuracy(result?.accuracy || 0);
  
      setBarProgress({
        time: timeEfficiencyPercent || 0,
        coverage: attemptedPercent || 0,
        efficiency: efficiencyScore || 0
      });
    }, 300);
  
    return () => clearTimeout(timeout);
  }, [attempt]);

  
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

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-slate-500">
          Attempt not found.
        </p>
      </div>
    );
  }  
  
  const { result, responses, examType, subjectName } = attempt;

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

  const efficiencyScore = Math.round(
    (accuracy * 100) * (1 - Math.min(avgTimeMs / (60 * 1000), 1) * 0.3)
  );  

  const performanceLabel =
    accuracy >= 0.9
      ? "Elite Performance"
      : accuracy >= 0.75
      ? "Strong Performance"
      : accuracy >= 0.5
      ? "Solid Attempt"
      : "Needs Improvement";

  const performanceColor =
    accuracy >= 0.9
      ? "text-emerald-600"
      : accuracy >= 0.75
      ? "text-blue-600"
      : accuracy >= 0.5
      ? "text-yellow-600"
      : "text-red-600";

    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen">
        <main className="max-w-[1180px] mx-auto px-6 py-6">
  
          {/* Page Heading */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex min-w-72 flex-col gap-2">
              <p className="text-[#0f0f1a] dark:text-white text-2xl font-black leading-tight tracking-[-0.033em]">
                Quiz Results
              </p>
              <p className="text-[#555591] dark:text-gray-400 text-base font-normal">
                {examType || "—"} - {subjectName || "—"}
              </p>
            </div>
  
            <div className="flex gap-3 items-start">
              <button
                className="flex items-center gap-1
                px-4 py-2 text-xs font-semibold rounded-xl
                bg-gradient-to-b from-white to-slate-200
                border border-slate-300
                shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                hover:scale-[1.03]
                transition-all duration-150
                active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15)]
                active:translate-y-[2px]"
              >
                <span className="material-symbols-outlined text-sm leading-none">
                  share
                </span>
                Flex Score
              </button>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
  
              {/* Score Hero Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6
              shadow-[8px_8px_18px_rgba(0,0,0,0.08),_-6px_-6px_14px_rgba(255,255,255,0.7)]
              border border-slate-200 dark:border-slate-800
              flex flex-col md:flex-row items-center gap-8">

              {/* Accuracy Dial */}
              <div className="relative flex items-center justify-center mb-4">
                <svg className="w-36 h-36 -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="currentColor"
                    className="text-primary"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={
                      2 * Math.PI * 60 -
                      (animatedAccuracy * (2 * Math.PI * 60))
                    }
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dashoffset 1s cubic-bezier(.4,1.4,.6,1)"
                    }}
                  />
                </svg>

                <div className="absolute -bottom-2 bg-white px-3 py-1 rounded-full
                  border border-slate-300
                  shadow-[4px_4px_8px_rgba(0,0,0,0.08)]
                  text-[11px] font-bold text-primary">
                  Rank #452
                </div>

                {/* Inner Skeuomorphic Plate */}
                <div className="absolute w-24 h-24 rounded-full
                  bg-gradient-to-br from-white to-slate-200
                  shadow-[inset_6px_6px_12px_rgba(0,0,0,0.08),inset_-6px_-6px_12px_rgba(255,255,255,0.9)]
                  flex flex-col items-center justify-center">

                  <span className="text-xl font-black text-primary">
                    {Math.round(accuracy * 100)}%
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">
                    Accuracy
                  </span>
                </div>
              </div>


              {/* Score Section */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                  Total Score
                </p>

                <h3 className="text-4xl font-black text-primary">
                  {score}
                  <span className="text-lg text-slate-400 font-medium">
                    / {totalQuestions}
                  </span>
                </h3>

                <p className={`text-sm font-semibold mt-3 ${performanceColor}`}>
                  {performanceLabel}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Keep pushing to climb the leaderboard.
                </p>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>XP Progress</span>
                    <span>{Math.round(accuracy * 500)} / 500 XP</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-200 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08)]">
                    <div
                      style={{ width: `${animatedAccuracy * 100}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-1000 ease-out"                      
                    />
                  </div>
                </div>
              </div>
            </div>

  
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                {[
                  { label: "Correct", value: correctCount, color: "text-emerald-600" },
                  { label: "Wrong", value: wrong, color: "text-red-600" },
                  { label: "Skipped", value: skippedCount, color: "text-slate-500" },
                  { label: "Marked", value: markedCount, color: "text-purple-600" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4
                      bg-gradient-to-b from-white to-slate-200
                      border border-slate-300
                      shadow-[6px_6px_12px_rgba(0,0,0,0.06),_-4px_-4px_8px_rgba(255,255,255,0.9)]"
                  >
                    <p className="text-[11px] uppercase tracking-widest text-slate-500">
                      {item.label}
                    </p>
                    <p className={`text-2xl font-bold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}

              </div>
  
              {/* Detailed Stats */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6
                shadow-[8px_8px_18px_rgba(0,0,0,0.08),_-6px_-6px_14px_rgba(255,255,255,0.7)]
                border border-slate-200 dark:border-slate-800">

                <h4 className="text-[#555591] text-base font-bold mb-6 pb-2 border-b border-[#d2d2e5] dark:border-[#2d2d45]">
                  Performance Breakdown
                </h4>

                {/* Metric Block */}
                <div className="space-y-6 text-sm">

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Avg per question</span>
                      <span>{formatTime(Math.round(avgTimeMs / 1000))}</span>
                    </div>

                    <div className="h-2 rounded-full
                      bg-slate-200
                      shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08)]">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-1000 ease-out"
                        style={{ width: `${barProgress.time}%` }}                        
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Attempt Coverage</span>
                      <span>{attemptedPercent}%</span>
                    </div>

                    <div className="h-2 rounded-full
                      bg-slate-200
                      shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08)]">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-1000 ease-out"
                        style={{ width: `${barProgress.coverage}%` }}                        
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Efficiency Score</span>
                      <span>{efficiencyScore}/100</span>
                    </div>

                    <div className="h-2 rounded-full
                      bg-slate-200
                      shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08)]">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-1000 ease-out"
                        style={{ width: `${barProgress.efficiency}%` }}                        
                      />
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      Combines accuracy with response speed for ranking.
                    </p>
                  </div>
                </div>
              </div>

  
            </div>
          {/* Right Column */}
          <div className="flex flex-col gap-6">

            {/* Consistency Badge Card */}
            <div className="rounded-2xl p-5
              bg-gradient-to-b from-white to-slate-200
              border border-slate-300
              shadow-[8px_8px_18px_rgba(0,0,0,0.08),_-6px_-6px_14px_rgba(255,255,255,0.8)]">

              {/* Top Section */}
              <div className="flex items-center gap-4 mb-5">

                {/* Medal */}
                <div className="w-12 h-12 rounded-full
                  bg-gradient-to-br from-yellow-200 to-yellow-400
                  border border-yellow-500
                  shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]
                  flex items-center justify-center">

                  <span className="material-symbols-outlined text-white text-lg">
                    military_tech
                  </span>
                </div>

                <div>
                  <h4 className="text-[#555591] text-base font-bold">
                    3-Day Streak
                  </h4>
                  <p className="text-xs text-slate-500">
                    Keep the momentum going
                  </p>
                </div>
              </div>

              {/* Week Circles */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  {["S","M","T","W","T","F","S"].map((d, i) => {
                    const active = i < 3;

                    return (
                      <div
                        key={i}
                        className={`w-7 h-7 rounded-full text-[11px] font-bold
                        flex items-center justify-center
                        border
                        ${
                          active
                            ? "bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-500 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2)]"
                            : "bg-gradient-to-b from-white to-slate-200 border-slate-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),_-3px_-3px_6px_rgba(255,255,255,0.9)]"
                        }`}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 text-sm font-bold text-orange-500">
                  <span className="material-symbols-outlined text-base animate-pulse">
                    local_fire_department
                  </span>
                  3
                </div>
              </div>

              <p className="text-xs text-slate-600 text-center">
                Complete one more test tomorrow to unlock
                <span className="font-semibold"> Bronze Disciplinarian</span>
              </p>
            </div>


            {/* Global Rank Stats */}
            <div className="rounded-2xl p-5
              bg-gradient-to-b from-white to-slate-200
              border border-slate-300
              shadow-[8px_8px_18px_rgba(0,0,0,0.08),_-6px_-6px_14px_rgba(255,255,255,0.8)]">

              <p className="text-[#555591] text-base font-bold dark:text-gray-400 mb-4">
                Community Comparison
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#0f0f1a] dark:text-white font-medium">
                    Global Rank
                  </span>
                  <span className="text-sm font-bold">#452</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#0f0f1a] dark:text-white font-medium">
                    Percentile
                  </span>
                  <span className="text-sm font-bold">
                    94.8%
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  {accuracy >= 0.9
                    ? "You’re competing at an elite level."
                    : accuracy >= 0.75
                    ? "You're above average this week."
                    : "Focus on accuracy to rise in rank."}
                </div>

                <div className="mt-2 px-3 py-2 rounded-xl
                  bg-gradient-to-b from-white to-slate-200
                  border border-slate-300
                  shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08)]
                  text-[11px] text-center font-semibold text-slate-700">
                  🏅 Top 5% This Week
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-2xl p-5
              bg-gradient-to-b from-white to-slate-200
              border border-slate-300
              shadow-[8px_8px_18px_rgba(0,0,0,0.08),_-6px_-6px_14px_rgba(255,255,255,0.8)]">
              <h4 className="text-sm text-[#555591] font-bold mb-4 uppercase tracking-widest">
                Power Moves
              </h4>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate(`/review/${attempt.attemptId}`)}
                  className="w-full flex items-center justify-between
                  px-4 py-3 rounded-xl text-sm font-semibold
                  bg-gradient-to-b from-primary to-blue-600
                  text-white
                  shadow-[6px_6px_12px_rgba(0,0,0,0.2)]
                  transition-all duration-150
                  active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)]
                  active:translate-y-[2px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      assignment_turned_in
                    </span>
                    Review Solutions
                  </div>
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>

                <button
                  onClick={() => navigate("/exams")}
                  className="w-full flex items-center justify-between
                  px-4 py-3 rounded-xl text-sm font-semibold
                  bg-gradient-to-b from-white to-slate-200
                  border border-slate-300
                  shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                  transition-all duration-150
                  active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15)]
                  active:translate-y-[2px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      restart_alt
                    </span>
                    Take Another Quiz
                  </div>
                  <span className="material-symbols-outlined text-sm">
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