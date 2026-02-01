export default function Review() {
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
                ExamArena
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
                      Question 14 of 100
                    </h1>
                    <p className="text-[#555591] dark:text-gray-400 text-sm font-normal">
                      Subject:{" "}
                      <span className="font-medium text-[#0f0f1a] dark:text-white">
                        Indian Polity &amp; Governance
                      </span>
                    </p>
                  </div>
  
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full bg-error-bg text-error-border text-sm font-bold border border-error-border flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                      Incorrect
                    </span>
                    <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
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
                  <p className="text-lg md:text-xl font-medium leading-relaxed mb-8">
                    With reference to the Constitution of India, consider the
                    following statements regarding the 'Doctrine of Pleasure':
                  </p>
  
                  <div className="space-y-3 mb-8">
                    <p className="flex gap-4">
                      <span className="font-bold">1.</span>
                      In India, the 'Doctrine of Pleasure' is subject to
                      constitutional limitations.
                    </p>
                    <p className="flex gap-4">
                      <span className="font-bold">2.</span>
                      Article 311 of the Constitution provides safeguards to civil
                      servants against arbitrary dismissal.
                    </p>
                    <p className="flex gap-4">
                      <span className="font-bold">3.</span>
                      The doctrine applies only to the civil services of the Union
                      and not to the states.
                    </p>
                  </div>
  
                  <p className="font-bold mb-6">
                    Which of the statements given above is/are correct?
                  </p>
  
                  {/* Options Grid */}
                  <div className="grid grid-cols-1 gap-4">
  
                    {/* Correct Option */}
                    <div className="flex items-center justify-between p-4 rounded-lg border-2 border-success-border bg-success-bg/30">
                      <div className="flex items-center gap-4">
                        <div className="size-8 rounded-full bg-success-border text-white flex items-center justify-center font-bold">
                          A
                        </div>
                        <p className="text-base font-medium">
                          1 and 2 only
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-success-border font-bold">
                        <span className="text-xs uppercase">
                          Correct Answer
                        </span>
                        <span className="material-symbols-outlined">
                          check_circle
                        </span>
                      </div>
                    </div>
  
                    {/* Incorrect User Selection */}
                    <div className="flex items-center justify-between p-4 rounded-lg border-2 border-error-border bg-error-bg/30">
                      <div className="flex items-center gap-4">
                        <div className="size-8 rounded-full bg-error-border text-white flex items-center justify-center font-bold">
                          B
                        </div>
                        <p className="text-base font-medium">
                          2 and 3 only
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-error-border font-bold">
                        <span className="text-xs uppercase">
                          Your Choice
                        </span>
                        <span className="material-symbols-outlined">
                          cancel
                        </span>
                      </div>
                    </div>
  
                    <div className="flex items-center justify-between p-4 rounded-lg border border-[#d2d2e5] dark:border-white/10 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-4">
                        <div className="size-8 rounded-full bg-[#e9e9f2] dark:bg-gray-700 text-[#0f0f1a] dark:text-white flex items-center justify-center font-bold">
                          C
                        </div>
                        <p className="text-base font-medium">
                          1 and 3 only
                        </p>
                      </div>
                    </div>
  
                    <div className="flex items-center justify-between p-4 rounded-lg border border-[#d2d2e5] dark:border-white/10 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-4">
                        <div className="size-8 rounded-full bg-[#e9e9f2] dark:bg-gray-700 text-[#0f0f1a] dark:text-white flex items-center justify-center font-bold">
                          D
                        </div>
                        <p className="text-base font-medium">
                          1, 2 and 3
                        </p>
                      </div>
                    </div>
  
                  </div>
                </div>
  
                {/* Explanation Card */}
                <div className="border-t border-[#d2d2e5] dark:border-white/10 bg-primary/5 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-primary dark:text-blue-400">
                      <span className="material-symbols-outlined">
                        lightbulb
                      </span>
                      Detailed Explanation
                    </h3>
                    <button className="text-primary font-medium hover:underline">
                      Download PDF
                    </button>
                  </div>
  
                  <div className="prose dark:prose-invert max-w-none space-y-4 text-sm md:text-base leading-relaxed text-[#444] dark:text-gray-300">
                    <p>
                      <strong className="text-[#0f0f1a] dark:text-white">
                        Analysis of Statement 1:
                      </strong>{" "}
                      Correct. In India, the 'Doctrine of Pleasure' is not absolute
                      as it is in English law. It is subject to constitutional
                      limitations provided under Article 311.
                    </p>
  
                    <p>
                      <strong className="text-[#0f0f1a] dark:text-white">
                        Analysis of Statement 2:
                      </strong>{" "}
                      Correct. Article 311 provides two main safeguards.
                    </p>
  
                    <p>
                      <strong className="text-[#0f0f1a] dark:text-white">
                        Analysis of Statement 3:
                      </strong>{" "}
                      Incorrect. The doctrine applies to both the civil services of
                      the Union and the States.
                    </p>
  
                    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-primary">
                      <h4 className="font-bold text-primary mb-2">
                        Key Concept: Article 310 &amp; 311
                      </h4>
                      <p>
                        Article 310 talks about pleasure, while Article 311 ensures
                        safeguards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
  
            {/* Bottom Navigation (Sticky behavior simulated) */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-[#d2d2e5] dark:border-white/10 flex justify-between items-center">
              <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#e9e9f2] dark:bg-gray-700 text-[#0f0f1a] dark:text-white font-bold hover:bg-[#d2d2e5] transition-colors">
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

              <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-opacity-90 transition-colors">
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
                <div className="size-10 flex items-center justify-center rounded bg-success-border/20 text-success-border font-bold text-sm cursor-pointer hover:bg-success-border/30 transition-colors">
                  1
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-success-border/20 text-success-border font-bold text-sm cursor-pointer hover:bg-success-border/30 transition-colors">
                  2
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-success-border/20 text-success-border font-bold text-sm cursor-pointer hover:bg-success-border/30 transition-colors">
                  3
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-success-border/20 text-success-border font-bold text-sm cursor-pointer hover:bg-success-border/30 transition-colors">
                  4
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-error-border/20 text-error-border font-bold text-sm cursor-pointer hover:bg-error-border/30 transition-colors">
                  5
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-success-border/20 text-success-border font-bold text-sm cursor-pointer hover:bg-success-border/30 transition-colors">
                  6
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-[#0f0f1a] dark:text-white font-bold text-sm cursor-pointer hover:bg-gray-200 transition-colors">
                  7
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-[#0f0f1a] dark:text-white font-bold text-sm cursor-pointer hover:bg-gray-200 transition-colors">
                  8
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-[#0f0f1a] dark:text-white font-bold text-sm cursor-pointer hover:bg-gray-200 transition-colors">
                  9
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-[#0f0f1a] dark:text-white font-bold text-sm cursor-pointer hover:bg-gray-200 transition-colors">
                  10
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-success-border/20 text-success-border font-bold text-sm cursor-pointer hover:bg-success-border/30 transition-colors">
                  11
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-success-border/20 text-success-border font-bold text-sm cursor-pointer hover:bg-success-border/30 transition-colors">
                  12
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-success-border/20 text-success-border font-bold text-sm cursor-pointer hover:bg-success-border/30 transition-colors">
                  13
                </div>
                <div className="size-10 flex items-center justify-center rounded ring-2 ring-primary bg-error-border/20 text-error-border font-bold text-sm">
                  14
                </div>
                <div className="size-10 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-[#0f0f1a] dark:text-white font-bold text-sm cursor-pointer hover:bg-gray-200 transition-colors">
                  15
                </div>
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

              <div className="flex flex-col gap-2 mt-2">
                <button className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#e9e9f2] dark:bg-gray-800 hover:bg-primary/10 transition-colors">
                  <span className="text-sm font-medium">
                    Question 1-20
                  </span>
                  <span className="material-symbols-outlined text-[18px]">
                    expand_more
                  </span>
                </button>
                <button className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#e9e9f2] dark:hover:bg-gray-800 transition-colors">
                  <span className="text-sm font-medium">
                    Question 21-40
                  </span>
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-primary text-primary text-sm font-bold hover:bg-primary/5">
                <span className="material-symbols-outlined text-[20px]">
                  report
                </span>
                Report Issue
              </button>

            </div>
          </aside>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 px-10 lg:px-40 border-t border-[#e9e9f2] dark:border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[#555591] dark:text-gray-400">
            <span className="font-bold text-lg">
              ExamArena
            </span>
            <span className="text-sm">
              © 2024 ExamArena. All rights reserved.
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
  