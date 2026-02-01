export default function CategorySelection() {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#0f0f1a] dark:text-white transition-colors duration-200">
  
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white dark:bg-background-dark border-b border-solid border-[#e9e9f2] dark:border-gray-800">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <div className="size-8 text-primary">
                <svg
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
                </svg>
              </div>
              <h1 className="text-[#0f0f1a] dark:text-white text-xl font-bold leading-tight tracking-tight">
                ExamArena
              </h1>
            </div>
  
            <nav className="hidden md:flex items-center gap-9">
              <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                Exams
              </a>
              <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                Results
              </a>
              <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                Dashboard
              </a>
              <a className="text-[#0f0f1a] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                Support
              </a>
            </nav>
  
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#e9e9f2] dark:bg-gray-800 text-[#0f0f1a] dark:text-white hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
  
              <div
                className="h-10 w-10 rounded-full bg-cover bg-center border border-gray-200"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCO4ZUPIJqUwUP3SRT-9ng0gvP3KLyn8YFyE3NwR7qYeDW6BMLHrJ7JzTkkR77jp5ZVTsgzrnpjx6clP7mOYPXEQDKTXbBThCroTCmVhPnI8HPWtlSE8KyrwYGxIqGIAFYPoYByEDS6pZEu3k0nPrnL95RceVRtfF7OrEabVvI2CaagjQNovrPcNHNsh5aX7NqC_TZ6sEbXm-DCoSChi3C8tRFiMl7Ix6fwIR3Ibi73GXSrFI46OUL7sCDCVkG9FjgjE5G8lXS0o9wo")',
                }}
              />
            </div>
          </div>
        </header>
  
        <main className="max-w-[1200px] mx-auto px-6 py-8">
  
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-8 text-[#555591] dark:text-gray-400">
            <a className="text-sm font-medium hover:text-primary flex items-center gap-1" href="#">
              <span className="material-symbols-outlined text-sm">home</span>
              Home
            </a>
            <span className="text-xs">/</span>
            <a className="text-sm font-medium hover:text-primary" href="#">
              SSC CGL 2024
            </a>
            <span className="text-xs">/</span>
            <span className="text-[#0f0f1a] dark:text-white text-sm font-semibold">
              Select Category
            </span>
          </nav>
  
          {/* Page Heading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div className="max-w-2xl">
              <h2 className="text-[#0f0f1a] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight mb-3">
                Choose Your Subject
              </h2>
              <p className="text-[#555591] dark:text-gray-400 text-lg">
                Select a category to begin your personalized practice session for the current exam tier.
              </p>
            </div>
  
            <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-white dark:bg-gray-800 text-primary dark:text-blue-400 border border-primary/20 hover:bg-primary/5 transition-all font-bold text-sm">
              <span className="material-symbols-outlined">swap_horiz</span>
              <span>Change Exam</span>
            </button>
          </div>
  
          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
  
            {/* Reasoning */}
            <div className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-xl overflow-hidden active:border-primary">
              <div
                className="h-48 bg-center bg-cover"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCujQU1PpfxrAz5rGvhcCSRMxJE4CMZLSS0TTzur_LMfjL6vOsD84vaJ8ADHuciF3VBgswyn0SRCwvIxJUnaxyp7Hl2B5P8aYzB3N6oLm-h7oN5rrorjSUffzlRf_QOXJMfrWBZXOjJv8fu8B_otdZcQGmGwIXWYAKuH3ZHKcThUfl45_f9LpxWls9bpXT-Zr_7nAyWshUihb5SrBLTOFrntOLIUzmCVmAx3OrfjEYecBr7AVseEpFhIbpq6Hk7R0Jq7M91DIyuK9L_")',
                }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-primary dark:text-blue-300">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                    Recommended
                  </span>
                </div>
  
                <h3 className="text-[#0f0f1a] dark:text-white text-xl font-bold mb-2">
                  Reasoning
                </h3>
  
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-[#555591] dark:text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-base">
                      format_list_numbered
                    </span>
                    25 Questions
                  </p>
                  <p className="flex items-center gap-2 text-[#555591] dark:text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-base">
                      timer
                    </span>
                    20 Mins
                  </p>
                  <p className="text-[#555591] dark:text-gray-400 text-sm mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 italic">
                    Logical reasoning, Venn diagrams, and pattern recognition.
                  </p>
                </div>
              </div>
            </div>
  
            {/* Quantitative Aptitude */}
            <div className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-xl border-2 border-primary transition-all cursor-pointer shadow-xl overflow-hidden ring-4 ring-primary/5">
              <div
                className="h-48 bg-center bg-cover"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPOSjm9DVnM6zkN0qRtGwieJfxS8EijeoVxDz39gV47zwWigVF5J5qqaQTrHaupr-JHZPfs7dVXwFBt4GD5RqFLj0um31o-mEyoa5xv1zn88_Upt3ZanwkszwZ_JSOEqJgt-wgZfHsKrz-jGYUNN7kERx192lVfzN9XgGpZgEipoxoWpo0F6tGFxxbc8PMkCQ7WyHb2J_NW0Zar2UgUAIFS5NrhNRAW16iYaslkBYjKPE0PrLzkF7aMch7raeE3bjx6rfR6mJxOfAw")',
                }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-primary dark:text-blue-300">
                    <span className="material-symbols-outlined">calculate</span>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                </div>
  
                <h3 className="text-[#0f0f1a] dark:text-white text-xl font-bold mb-2">
                  Quantitative Aptitude
                </h3>
  
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-[#555591] dark:text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-base">
                      format_list_numbered
                    </span>
                    25 Questions
                  </p>
                  <p className="flex items-center gap-2 text-[#555591] dark:text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-base">
                      timer
                    </span>
                    20 Mins
                  </p>
                  <p className="text-[#555591] dark:text-gray-400 text-sm mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 italic">
                    Advanced mathematics, geometry, and data interpretation.
                  </p>
                </div>
              </div>
            </div>
  
            {/* General Awareness */}
            <div className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-xl overflow-hidden active:border-primary">
              <div
                className="h-48 bg-center bg-cover"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDq4fZ9_vK0uZ74WrfDQz09OxzYPO-cj340I5AQuaE1UXgUN0Qt_KtBpnzGYg21uKi4whFkVBVgJT_5eUz8jVUDSdF6tRIwqmnH0vf8a_HoBO8xvjg_CsZxEA3Y8ImR94tdTZfwNeWNk41KuMZPEvyH6IL4rlDo2kUByXck3ynMbcbgIL3EWHSQsWzB1L73Iz4JEyQvG_v18PWVeJq5YvPS9D1CaeGlrmXb6j3sX8A4p-OiN49IznyT1lrKv3R3j9KTG0kAIzHuWFcb")',
                }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-primary dark:text-blue-300">
                    <span className="material-symbols-outlined">public</span>
                  </div>
                </div>
  
                <h3 className="text-[#0f0f1a] dark:text-white text-xl font-bold mb-2">
                  General Awareness
                </h3>
  
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-[#555591] dark:text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-base">
                      format_list_numbered
                    </span>
                    25 Questions
                  </p>
                  <p className="flex items-center gap-2 text-[#555591] dark:text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-base">
                      timer
                    </span>
                    20 Mins
                  </p>
                  <p className="text-[#555591] dark:text-gray-400 text-sm mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 italic">
                    Static GK, Current Affairs, and Indian Polity.
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Action Panel */}
          <div className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-[#d2d2e5] dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 p-2 rounded-full">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[#0f0f1a] dark:text-white text-lg font-bold">
                    Questions will be from selected category only
                  </p>
                  <p className="text-[#555591] dark:text-gray-400 text-base">
                    Your selection:{" "}
                    <span className="text-primary dark:text-blue-400 font-semibold">
                      Quantitative Aptitude
                    </span>
                    . Ensure you are ready for the time limit before starting.
                  </p>
                </div>
              </div>
  
              <button className="w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-primary text-white text-lg font-bold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 active:translate-y-0">
                <span>Start Quiz</span>
                <span className="material-symbols-outlined">play_arrow</span>
              </button>
            </div>
  
            <p className="mt-6 text-center text-sm text-[#555591] dark:text-gray-500 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">security</span>
              Verified Exam Environment
            </p>
          </div>
        </main>
  
        {/* Footer */}
        <footer className="mt-12 py-8 border-t border-[#e9e9f2] dark:border-gray-800">
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#555591] dark:text-gray-500">
            <p>© 2024 ExamArena. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-primary" href="#">Guidelines</a>
              <a className="hover:text-primary" href="#">Syllabus</a>
              <a className="hover:text-primary" href="#">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  