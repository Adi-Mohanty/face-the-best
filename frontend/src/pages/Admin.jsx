export default function Admin() {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display">
        <div className="flex h-screen overflow-hidden">
  
          {/* SideNavBar */}
          <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark flex flex-col justify-between p-4">
            <div className="flex flex-col gap-8">
  
              <div className="flex items-center gap-3 px-2">
                <div className="bg-primary rounded-lg p-2 text-white">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-[#0f0f1a] dark:text-white text-lg font-bold leading-tight tracking-tight">
                    ExamArena
                  </h1>
                  <p className="text-[#555591] dark:text-gray-400 text-xs font-medium">
                    Admin Panel
                  </p>
                </div>
              </div>
  
              <nav className="flex flex-col gap-1">
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">dashboard</span>
                  <p className="text-sm font-medium">Dashboard</p>
                </a>
  
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-colors"
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    description
                  </span>
                  <p className="text-sm font-semibold">Questions</p>
                </a>
  
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                  <p className="text-sm font-medium">Exams</p>
                </a>
  
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">group</span>
                  <p className="text-sm font-medium">Users</p>
                </a>
  
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[22px]">settings</span>
                    <p className="text-sm font-medium">Settings</p>
                  </a>
                </div>
              </nav>
            </div>
  
            <div className="p-2">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div
                  className="w-8 h-8 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFQS_R_JB0c7SU-oWtORT2rtPZTy8LquXqOLsStFS0YPv0SX7wjRqOMUu3Jcn0Ui4MXSPPFpBnBlWf5_oaeQuHlW_1uNhoa05GprMoLuvNJdnClH5uvKJ-yJb82q6e0fhe1mi_AaUEeF9jFGrcWXnTZOrJYIO5YnsW7wXDPTrfayIQyKN5IA4nL3LepWDapbYj3LO7DR2sRwEuan4qSHhyC4OrAuZDVDoFWOkw9fC8d2afvBUQCpTq92-yuZnUNgCcnsFi3nflAw9G')",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    Admin Account
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    admin@examarena.in
                  </p>
                </div>
              </div>
            </div>
          </aside>
  
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
            <div className="max-w-[1000px] mx-auto px-8 py-10">
  
              {/* Page Heading */}
              <div className="mb-8">
                <h2 className="text-[#0f0f1a] dark:text-white text-3xl font-black leading-tight tracking-tight">
                  Generate Questions
                </h2>
                <p className="text-[#555591] dark:text-gray-400 text-base font-normal mt-1">
                  Configure parameters to populate the question bank with AI-driven content.
                </p>
              </div>
  
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-7">
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <div className="space-y-6">
                    {/* Target Exam */}
                    <div>
                      <label className="block mb-2 text-[#0f0f1a] dark:text-gray-200 text-sm font-semibold">
                        Target Exam
                      </label>
                      <div className="relative custom-select">
                        <select
                          defaultValue=""
                          className="appearance-none w-full px-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0f0f1a] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        >
                          <option disabled value="">
                            Select Exam Type...
                          </option>
                          <option value="upsc">UPSC Civil Services</option>
                          <option value="ssc">SSC CGL</option>
                          <option value="jee">JEE Advanced</option>
                          <option value="neet">NEET UG</option>
                          <option value="cat">CAT</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                          <span className="material-symbols-outlined text-xl">
                            unfold_more
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block mb-2 text-[#0f0f1a] dark:text-gray-200 text-sm font-semibold">
                        Subject / Category
                      </label>
                      <div className="relative custom-select">
                        <select
                          defaultValue=""
                          className="appearance-none w-full px-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0f0f1a] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        >
                          <option disabled value="">
                            Select Category...
                          </option>
                          <option value="gs">General Studies</option>
                          <option value="qa">Quantitative Aptitude</option>
                          <option value="lr">Logical Reasoning</option>
                          <option value="eng">English Language</option>
                          <option value="phy">Physics</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                          <span className="material-symbols-outlined text-xl">
                            unfold_more
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block mb-2 text-[#0f0f1a] dark:text-gray-200 text-sm font-semibold">
                        Number of Questions
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={1}
                          max={100}
                          defaultValue={25}
                          className="w-full px-4 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0f0f1a] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        />
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          Max: 100 per batch
                        </p>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block mb-2 text-[#0f0f1a] dark:text-gray-200 text-sm font-semibold">
                        Difficulty Level
                      </label>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary transition-all">
                          Easy
                        </button>
                        <button className="flex-1 py-2 text-xs font-semibold rounded-lg border-2 border-primary bg-primary/5 text-primary">
                          Medium
                        </button>
                        <button className="flex-1 py-2 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary transition-all">
                          Hard
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <button className="w-full bg-primary hover:bg-[#15156b] text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">bolt</span>
                        Generate Questions
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Card */}
              <div className="lg:col-span-5">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="h-40 bg-primary/10 relative flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-6xl text-primary opacity-20">
                      psychology
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-[#0f0f1a] dark:text-white text-lg font-bold mb-2">
                      Generation Statistics
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Total Questions Generated
                        </span>
                        <span className="text-sm font-bold">12,402</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Available Credits
                        </span>
                        <span className="text-sm font-bold text-primary">
                          4,850
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Last Batch Status
                        </span>
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Complete
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">
                          info
                        </span>
                        <p className="text-xs text-[#555591] dark:text-gray-300 leading-relaxed">
                          Automated generation uses our high-performance AI model.
                          Each batch takes approximately 30–60 seconds to process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Success Snackbar */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-white dark:bg-gray-900 border-l-4 border-green-500 shadow-2xl rounded-lg p-4 flex items-center gap-4 min-w-[320px]">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600">
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold">Success!</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              25 questions have been added to the queue.
            </p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
  