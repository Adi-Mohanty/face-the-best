export default function Quiz() {
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
                ExamArena - Mock Test 04
              </h2>
            </div>
  
            <div className="flex items-center gap-6">
              {/* Countdown Timer */}
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-100 dark:border-red-800">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">
                  timer
                </span>
                <span className="text-red-600 dark:text-red-400 font-bold text-lg tabular-nums">
                  45:12
                </span>
              </div>
  
              {/* Progress Counter */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Progress
                </span>
                <span className="text-slate-900 dark:text-slate-100 font-bold">
                  3 / 10
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
                  30%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "30%" }}
                />
              </div>
            </div>
  
            {/* Question Area */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary dark:text-blue-400 rounded text-xs font-bold uppercase mb-4 tracking-wider">
                Reasoning &amp; Logic
              </div>
  
              <h1 className="text-2xl font-bold mb-6">Question 3</h1>
  
              <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200 mb-8">
                If A + B means A is the brother of B; A - B means A is the sister of B
                and A * B means A is the father of B. Which of the following means
                that C is the son of M?
              </p>
  
              {/* Options */}
              <div className="space-y-4">
                <label className="group relative flex items-center p-5 border-2 border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-primary/40 transition-all bg-white dark:bg-slate-900 shadow-sm">
                  <input
                    type="radio"
                    name="quiz-option"
                    className="w-5 h-5 text-primary border-slate-300 focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
                  />
                  <span className="ml-4 text-slate-700 dark:text-slate-300 font-medium">
                    M * N - C + F
                  </span>
                </label>
  
                <label className="group relative flex items-center p-5 border-2 border-primary rounded-xl cursor-pointer bg-primary/5 dark:bg-primary/10 transition-all shadow-sm ring-1 ring-primary">
                  <input
                    type="radio"
                    name="quiz-option"
                    checked
                    className="w-5 h-5 text-primary border-slate-300 focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
                  />
                  <span className="ml-4 text-slate-900 dark:text-white font-semibold">
                    F - C + N * M
                  </span>
                </label>
  
                <label className="group relative flex items-center p-5 border-2 border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-primary/40 transition-all bg-white dark:bg-slate-900 shadow-sm">
                  <input
                    type="radio"
                    name="quiz-option"
                    className="w-5 h-5 text-primary border-slate-300 focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
                  />
                  <span className="ml-4 text-slate-700 dark:text-slate-300 font-medium">
                    N + M - F * C
                  </span>
                </label>
  
                <label className="group relative flex items-center p-5 border-2 border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-primary/40 transition-all bg-white dark:bg-slate-900 shadow-sm">
                  <input
                    type="radio"
                    name="quiz-option"
                    className="w-5 h-5 text-primary border-slate-300 focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
                  />
                  <span className="ml-4 text-slate-700 dark:text-slate-300 font-medium">
                    M * C - N + F
                  </span>
                </label>
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
                <button className="aspect-square rounded-lg bg-emerald-500 text-white font-bold">1</button>
                <button className="aspect-square rounded-lg bg-emerald-500 text-white font-bold">2</button>
                <button className="aspect-square rounded-lg bg-primary text-white font-bold ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900">3</button>
                <button className="aspect-square rounded-lg bg-amber-400 text-white font-bold">4</button>
                {[5,6,7,8,9,10].map(n => (
                  <button
                    key={n}
                    className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold border border-slate-200 dark:border-slate-700"
                  >
                    {n}
                  </button>
                ))}
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
                  <span className="text-sm">Marked for Review</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-4 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                  <span className="text-sm">Not Visited</span>
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
              <button className="px-6 h-11 rounded-lg border font-bold flex items-center">
                <span className="material-symbols-outlined mr-2">bookmark</span>
                Mark for Review
              </button>
              <button className="px-6 h-11 rounded-lg border font-bold">
                Skip Question
              </button>
            </div>
  
            <div className="flex gap-4">
              <button className="px-6 h-11 rounded-lg border font-bold">
                Previous
              </button>
              <button className="px-8 h-11 rounded-lg bg-primary text-white font-bold flex items-center">
                Submit &amp; Next
                <span className="material-symbols-outlined ml-2">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  