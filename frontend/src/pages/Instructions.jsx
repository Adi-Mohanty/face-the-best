export default function Instructions() {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-[#0f0f1a] dark:text-gray-100 min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
  
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e9e9f2] dark:border-b-gray-800 px-10 py-3 bg-white dark:bg-gray-900 sticky top-0 z-50">
              <div className="flex items-center gap-4 text-primary dark:text-blue-400">
                <div className="size-6">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
                  </svg>
                </div>
                <h2 className="text-[#0f0f1a] dark:text-white text-xl font-bold leading-tight tracking-tight">
                  ExamArena
                </h2>
              </div>
  
              <div className="flex flex-1 justify-end gap-8">
                <div className="hidden md:flex items-center gap-9">
                  <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                    Dashboard
                  </a>
                  <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                    Mock Tests
                  </a>
                  <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                    Practice
                  </a>
                  <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                    Performance
                  </a>
                </div>
  
                <div className="flex gap-2">
                  <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 text-[#0f0f1a] dark:text-gray-200">
                    <span className="material-symbols-outlined">notifications</span>
                  </button>
                  <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 text-[#0f0f1a] dark:text-gray-200">
                    <span className="material-symbols-outlined">account_circle</span>
                  </button>
                </div>
              </div>
            </header>
  
            {/* Main Content Area */}
            <main className="flex flex-1 justify-center py-10 px-4 md:px-10 lg:px-40">
              <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
  
                {/* Page Heading */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-[#0f0f1a] dark:text-white text-4xl font-black leading-tight tracking-tight">
                      Quiz Instructions
                    </h1>
                    <p className="text-[#555591] dark:text-gray-400 text-lg font-normal">
                      UPSC CSAT Mock Series - Practice Set 04
                    </p>
                  </div>
  
                  <button className="flex items-center gap-2 cursor-pointer rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 text-[#0f0f1a] dark:text-gray-200 text-sm font-bold border border-[#d2d2e5] dark:border-gray-700 hover:bg-gray-200 transition-colors">
                    <span className="material-symbols-outlined text-base">
                      arrow_back
                    </span>
                    <span className="truncate">Back to Dashboard</span>
                  </button>
                </div>
  
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#d2d2e5] dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="material-symbols-outlined text-primary dark:text-blue-400">
                        quiz
                      </span>
                      <p className="text-[#555591] dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                        Total Questions
                      </p>
                    </div>
                    <p className="text-[#0f0f1a] dark:text-white text-2xl font-bold">
                      10 Questions
                    </p>
                  </div>
  
                  <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#d2d2e5] dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="material-symbols-outlined text-primary dark:text-blue-400">
                        timer
                      </span>
                      <p className="text-[#555591] dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                        Duration
                      </p>
                    </div>
                    <p className="text-[#0f0f1a] dark:text-white text-2xl font-bold">
                      10 Minutes
                    </p>
                  </div>
  
                  <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#d2d2e5] dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="material-symbols-outlined text-primary dark:text-blue-400">
                        military_tech
                      </span>
                      <p className="text-[#555591] dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                        Total Marks
                      </p>
                    </div>
                    <p className="text-[#0f0f1a] dark:text-white text-2xl font-bold">
                      20 Marks
                    </p>
                  </div>
                </div>
  
                {/* Instruction Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-[#d2d2e5] dark:border-gray-700 shadow-sm overflow-hidden mb-10">
                  <div className="bg-primary/5 dark:bg-primary/20 border-b border-[#d2d2e5] dark:border-gray-700 px-8 py-5">
                    <h2 className="text-primary dark:text-blue-300 text-xl font-bold">
                      General Instructions
                    </h2>
                  </div>
  
                  <div className="p-8 space-y-2">
  
                    {/* Instruction Items */}
                    {[
                      ["check_circle", "Standard Marking Scheme", "Each question carries 2 marks for a correct response.", "text-green-600 dark:text-green-400"],
                      ["check_circle", "Negative Marking Policy", "No negative marking for incorrect answers in this practice set.", "text-green-600 dark:text-green-400"],
                      ["info", "Time Management", "The timer will start immediately after you click the 'Start Quiz' button.", "text-primary dark:text-blue-400"],
                      ["warning", "Auto-Submission", "The test will auto-submit when the timer reaches zero. Ensure you review answers before time expires.", "text-orange-600 dark:text-orange-400"],
                      ["block", "Session Integrity", "Do not refresh the page or switch tabs during the examination to avoid disqualification.", "text-red-600 dark:text-red-400"],
                    ].map(([icon, title, desc, color], i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 py-4 border-b border-gray-50 dark:border-gray-800 last:border-0"
                      >
                        <span className={`material-symbols-outlined mt-0.5 ${color}`}>
                          {icon}
                        </span>
                        <div className="flex flex-col">
                          <p className="text-[#0f0f1a] dark:text-gray-100 text-lg font-medium">
                            {title}
                          </p>
                          <p className="text-[#555591] dark:text-gray-400 text-base">
                            {desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
  
                  {/* Acknowledgement */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-8 border-t border-[#d2d2e5] dark:border-gray-700">
                    <label className="flex items-center gap-3 mb-8 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-[#d2d2e5] dark:border-gray-600 text-primary focus:ring-primary"
                      />
                      <span className="text-[#0f0f1a] dark:text-gray-200 text-base font-medium group-hover:text-primary transition-colors">
                        I have read and understood all instructions provided above.
                      </span>
                    </label>
  
                    <div className="flex flex-col items-center gap-4">
                      <button className="flex min-w-[240px] items-center justify-center rounded-xl h-14 bg-primary text-white text-lg font-extrabold shadow-lg shadow-primary/20 hover:bg-[#15156a] transition-all transform hover:scale-[1.02]">
                        Start Quiz
                      </button>
                      <p className="text-gray-500 dark:text-gray-400 text-xs text-center">
                        By clicking Start Quiz, you agree to follow the examination code of conduct.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
  
            {/* Footer */}
            <footer className="py-10 px-10 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2024 ExamArena. All rights reserved. Secure assessment environment.
              </p>
            </footer>
          </div>
        </div>
      </div>
    );
  }
  