import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo + App Name */}
        <div 
          onClick={() => navigate("/exams")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
            {/* Replace with your SVG later */}
            <span className="font-bold text-lg">F</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">
            Face The Best
          </h1>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <NavLink
            to="/exams"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "text-slate-600 hover:text-primary transition-colors"
            }
          >
            Exams
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "text-slate-600 hover:text-primary transition-colors"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "text-slate-600 hover:text-primary transition-colors"
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/social"
            className={({ isActive }) =>
              isActive
                ? "text-primary"
                : "text-slate-600 hover:text-primary transition-colors"
            }
          >
            Social
          </NavLink>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold shadow-md hover:opacity-90 transition-all">
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}