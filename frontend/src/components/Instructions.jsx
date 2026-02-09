import { useState } from "react";

export default function InstructionsModal({ onConfirm }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-background-light dark:bg-gray-900 w-[900px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="px-8 py-6 border-b border-[#e9e9f2] dark:border-gray-700 bg-white dark:bg-gray-900">
          <h2 className="text-2xl font-black text-[#0f0f1a] dark:text-white">
            Quiz Instructions
          </h2>
          <p className="text-[#555591] dark:text-gray-400 text-sm mt-1">
            Please read all instructions carefully before starting
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              ["quiz", "Total Questions", "10"],
              ["timer", "Duration", "10 Minutes"],
              ["military_tech", "Total Marks", "20"],
            ].map(([icon, label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-2 rounded-xl p-5 border border-[#d2d2e5] dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    {icon}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#555591] dark:text-gray-400">
                    {label}
                  </p>
                </div>
                <p className="text-xl font-bold text-[#0f0f1a] dark:text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-[#d2d2e5] dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="bg-primary/5 dark:bg-primary/20 px-6 py-4 border-b border-[#d2d2e5] dark:border-gray-700">
              <h3 className="text-primary text-lg font-bold">
                General Instructions
              </h3>
            </div>

            <div className="px-6 py-4 space-y-3">
              {[
                ["check_circle", "Standard Marking Scheme", "Each question carries 2 marks.", "text-green-600"],
                ["check_circle", "Negative Marking Policy", "No negative marking in this quiz.", "text-green-600"],
                ["info", "Time Management", "Timer starts immediately after clicking Start.", "text-primary"],
                ["warning", "Auto Submission", "Quiz auto-submits when time ends.", "text-orange-600"],
                ["block", "Session Integrity", "Do not refresh or switch tabs.", "text-red-600"],
              ].map(([icon, title, desc, color], i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 py-3 border-b last:border-0 border-gray-50 dark:border-gray-800"
                >
                  <span className={`material-symbols-outlined ${color}`}>
                    {icon}
                  </span>
                  <div>
                    <p className="font-medium text-[#0f0f1a] dark:text-gray-100">
                      {title}
                    </p>
                    <p className="text-sm text-[#555591] dark:text-gray-400">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acknowledgement */}
          <label className="flex items-center gap-3 mt-8 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-[#0f0f1a] dark:text-gray-200">
              I have read and understood all instructions.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-[#e9e9f2] dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end">
          <button
            disabled={!accepted}
            onClick={onConfirm}
            className={`min-w-[220px] h-12 rounded-xl font-bold transition-all
              ${
                accepted
                  ? "bg-primary text-white hover:scale-[1.02] shadow-lg shadow-primary/20"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
