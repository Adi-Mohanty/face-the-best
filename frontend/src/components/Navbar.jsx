import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Logo from "../assets/Logo";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);

      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header
      className="
        sticky top-0 z-50

        bg-gradient-to-b from-white to-slate-200
        dark:from-slate-900 dark:to-slate-950

        border-b border-slate-300 dark:border-slate-800

        shadow-[inset_0px_1px_0px_rgba(255,255,255,0.7),
                0px_6px_16px_rgba(0,0,0,0.08)]
      "
    >
      <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => navigate("/exams")}
          className="
            flex items-center gap-3 cursor-pointer
            active:translate-y-[1px]
          "
        >
          <Logo size={34} />

          <h1 className="text-lg font-bold tracking-tight text-slate-700 dark:text-white">
            Face The Best
          </h1>
        </div>


        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">

          {[
            { name: "Exams", path: "/exams" },
            { name: "Dashboard", path: "/dashboard" },
            { name: "Profile", path: "/profile" },
            { name: "Social", path: "/social" }
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                px-3 py-1.5 rounded-lg text-sm

                transition-all duration-150

                ${
                  isActive
                    ? `
                    bg-gradient-to-b from-white to-slate-200
                    border border-slate-300
                    shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15)]
                    text-primary
                    `
                    : `
                    text-slate-600
                    hover:text-primary
                    `
                }
              `}
            >
              {item.name}
            </NavLink>
          ))}

        </nav>


        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2

            px-4 py-1.5
            text-xs font-semibold
            rounded-xl

            bg-gradient-to-b from-primary to-blue-600
            text-white

            border border-blue-700

            shadow-[6px_6px_12px_rgba(0,0,0,0.2)]

            transition-all duration-150

            active:translate-y-[2px]
            active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.35)]
          "
        >
          <span className="material-symbols-outlined text-sm">
            logout
          </span>

          Logout
        </button>

      </div>
    </header>
  );
}
