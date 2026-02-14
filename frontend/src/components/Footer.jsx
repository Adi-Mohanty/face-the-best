export default function Footer() {
    return (
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16">
        <div className="max-w-[1440px] mx-auto px-6 py-10">
          
          <div className="flex flex-col md:flex-row justify-between gap-10">
            
            {/* Brand */}
            <div>
              <h2 className="text-lg font-bold mb-2">
                Face The Best
              </h2>
              <p className="text-sm text-slate-500 max-w-sm">
                Compete. Improve. Dominate.
                <br />
                The ultimate arena for serious exam aspirants.
              </p>
            </div>
  
            {/* Links */}
            <div className="grid grid-cols-2 gap-10 text-sm">
              <div className="flex flex-col gap-3">
                <span className="font-semibold">Platform</span>
                <span className="text-slate-500 hover:text-primary cursor-pointer">
                  Exams
                </span>
                <span className="text-slate-500 hover:text-primary cursor-pointer">
                  Leaderboards
                </span>
                <span className="text-slate-500 hover:text-primary cursor-pointer">
                  Tournaments
                </span>
              </div>
  
              <div className="flex flex-col gap-3">
                <span className="font-semibold">Account</span>
                <span className="text-slate-500 hover:text-primary cursor-pointer">
                  Profile
                </span>
                <span className="text-slate-500 hover:text-primary cursor-pointer">
                  Achievements
                </span>
                <span className="text-slate-500 hover:text-primary cursor-pointer">
                  Settings
                </span>
              </div>
            </div>
          </div>
  
          <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-500 text-center">
            © {new Date().getFullYear()} Face The Best. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }  