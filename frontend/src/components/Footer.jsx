export default function Footer() {
  return (
    <footer
      className="
        mt-14

        bg-gradient-to-b from-white to-slate-200
        dark:from-slate-900 dark:to-slate-950

        border-t border-slate-300 dark:border-slate-800

        shadow-[inset_0px_2px_4px_rgba(255,255,255,0.6),
                inset_0px_-2px_6px_rgba(0,0,0,0.05)]
      "
    >
      <div className="max-w-[1440px] mx-auto px-6 py-7">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-base font-bold tracking-tight">
              Face The Best
            </h2>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Gamified Exam Preparation for Serious Aspirants.
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Compete. Improve. Dominate.
            </p>
          </div>


          {/* Links */}
          <div className="grid grid-cols-2 gap-8 text-xs">

            {/* Platform */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide text-[11px]">
                Platform
              </span>

              <span className="text-slate-500 hover:text-primary transition cursor-pointer">
                Exams
              </span>

              <span className="text-slate-500 hover:text-primary transition cursor-pointer">
                Leaderboards
              </span>

              <span className="text-slate-500 hover:text-primary transition cursor-pointer">
                Tournaments
              </span>
            </div>


            {/* Account */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide text-[11px]">
                Account
              </span>

              <span className="text-slate-500 hover:text-primary transition cursor-pointer">
                Profile
              </span>

              <span className="text-slate-500 hover:text-primary transition cursor-pointer">
                Achievements
              </span>

              <span className="text-slate-500 hover:text-primary transition cursor-pointer">
                Settings
              </span>
            </div>

          </div>

        </div>


        {/* Divider */}
        <div
          className="
            mt-6 pt-4

            border-t border-slate-300 dark:border-slate-800

            shadow-[inset_0px_1px_2px_rgba(255,255,255,0.7)]
          "
        >


          {/* Bottom Line */}
          <div className="text-center text-[11px] text-slate-500">
            © {new Date().getFullYear()} Face The Best • Built for Competitive Aspirants
          </div>

        </div>

      </div>
    </footer>
  );
}
