import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display">

      {/* HERO */}
      <section className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Welcome to <span className="text-primary">Face The Best</span>
          </h1>

          <p className="text-lg text-[#555591] dark:text-gray-400 mb-10">
            Your personalized exam preparation journey starts here.
            Choose your exam, focus on the right subjects, and practice with
            high-quality AI-verified questions.
          </p>

          <button
            onClick={() => navigate("/exams")}
            className="inline-flex items-center gap-2 px-10 h-14 rounded-xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] transition"
          >
            Choose My Exam
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: "school",
              title: "Select Exam",
              desc: "Pick the exam you’re preparing for"
            },
            {
              icon: "menu_book",
              title: "Choose Subjects",
              desc: "Focus only on what matters"
            },
            {
              icon: "psychology",
              title: "Practice Smart",
              desc: "AI-verified questions & tests"
            }
          ].map(step => (
            <div key={step.title} className="p-6 rounded-xl bg-white dark:bg-[#1a1a2e] shadow-sm">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">
                {step.icon}
              </span>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-[#555591] dark:text-gray-400">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}