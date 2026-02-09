import { useMemo } from "react";

export default function SubjectActionModal({
  exam,
  subject,
  onClose,
  onStartQuiz
}) {
  const timeLeft = useMemo(() => {
    const now = new Date();
    const noon = new Date();
    noon.setHours(12, 0, 0, 0);
    if (now > noon) noon.setDate(noon.getDate() + 1);

    const diff = noon - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[460px] rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-2xl animate-scaleIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-primary font-bold">
            {exam.type}
          </p>
          <h2 className="text-2xl font-black mt-1">
            {subject.name}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Choose how you want to practice this subject
          </p>
        </div>

        {/* Primary Action */}
        <button
          onClick={onStartQuiz}
          className="w-full mb-5 h-14 rounded-xl bg-primary text-white font-black text-lg
                     flex items-center justify-center gap-3
                     shadow-lg shadow-primary/30
                     hover:scale-[1.02] transition"
        >
          <span className="material-symbols-outlined text-2xl">
            play_arrow
          </span>
          Start Practice Quiz
        </button>

        {/* Secondary modes */}
        <div className="grid grid-cols-2 gap-4">

          <ModeCard
            icon="swords"
            title="1v1 Battle"
            subtitle="Challenge others"
            disabled
          />

          <ModeCard
            icon="smart_toy"
            title="Vs AI Bot"
            subtitle="Instant practice"
            disabled
          />

          <ModeCard
            icon="emoji_events"
            title="Daily Tournament"
            subtitle={`Starts in ${timeLeft}`}
            disabled
            full
          />
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center text-xs text-gray-400">
          More modes unlock soon 🚀
        </p>
      </div>
    </div>
  );
}

function ModeCard({ icon, title, subtitle, disabled, full }) {
  return (
    <div
      className={`relative rounded-xl border p-4 text-left
        ${full ? "col-span-2" : ""}
        ${disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:border-primary hover:shadow-md cursor-pointer"}
      `}
    >
      <span className="material-symbols-outlined text-primary text-xl mb-2 block">
        {icon}
      </span>
      <p className="font-bold text-sm">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>

      {disabled && (
        <span className="absolute top-3 right-3 text-[10px] bg-gray-200 px-2 py-0.5 rounded-full">
          Soon
        </span>
      )}
    </div>
  );
}
