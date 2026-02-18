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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      {/* Outer shell */}
      <div
        className="
        relative w-[460px] rounded-3xl px-7 py-7

        bg-gradient-to-b from-white to-slate-200
        border border-slate-300

        shadow-[20px_20px_40px_rgba(0,0,0,0.25),_-10px_-10px_20px_rgba(255,255,255,0.95)]

        animate-scaleIn
      "
      >

        {/* Close */}
        <button
          onClick={onClose}
          className="
          absolute top-4 right-4
          w-8 h-8 rounded-lg

          bg-gradient-to-b from-white to-slate-200
          border border-slate-300

          shadow-[4px_4px_8px_rgba(0,0,0,0.15),_-3px_-3px_6px_rgba(255,255,255,0.95)]

          flex items-center justify-center
          text-slate-600

          active:translate-y-[1px]
          active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2)]
        "
        >
          ✕
        </button>


        {/* Header */}
        <div className="mb-6">

          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
            {exam.type}
          </p>

          <h2 className="text-2xl font-black mt-1 text-slate-800">
            {subject.name}
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Choose your battle mode
          </p>

        </div>


        {/* Start Quiz Button */}
        <button
          onClick={onStartQuiz}
          className="
          w-full mb-5 h-14 rounded-xl

          bg-gradient-to-b from-primary to-blue-600
          border border-blue-700

          text-white font-bold text-lg

          flex items-center justify-center gap-3

          shadow-[0_10px_20px_rgba(79,70,229,0.45)]

          transition-all duration-150

          active:translate-y-[2px]
          active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)]
        "
        >
          <span className="material-symbols-outlined text-2xl">
            play_arrow
          </span>

          Start Practice Quiz
        </button>


        {/* Mode cards */}
        <div className="grid grid-cols-2 gap-4">

          <ModeCard
            icon="swords"
            title="1v1 Battle"
            subtitle="Challenge real opponents"
            disabled
          />

          <ModeCard
            icon="smart_toy"
            title="Vs AI Bot"
            subtitle="Train instantly"
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


        <p className="mt-6 text-center text-xs font-medium text-slate-500">
          New battle modes unlocking soon
        </p>

      </div>
    </div>
  );
}


function ModeCard({ icon, title, subtitle, disabled, full }) {

  return (
    <div
      className={`
        relative rounded-xl px-4 py-4

        border

        ${full ? "col-span-2" : ""}

        ${
          disabled
            ? `
            bg-gradient-to-b from-white to-slate-200
            border-slate-300

            shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15)]

            opacity-60
            `
            : `
            bg-gradient-to-b from-white to-slate-200
            border-slate-300

            shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_8px_rgba(255,255,255,0.95)]

            cursor-pointer

            active:translate-y-[2px]
            active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]
            `
        }
      `}
    >

      <span className="material-symbols-outlined text-primary text-xl mb-2 block">
        {icon}
      </span>

      <p className="font-bold text-sm text-slate-700">
        {title}
      </p>

      <p className="text-xs text-slate-500">
        {subtitle}
      </p>


      {disabled && (
        <div
          className="
          absolute top-2 right-2

          px-2 py-[2px]
          text-[10px] font-bold

          rounded-full

          bg-gradient-to-b from-white to-slate-200
          border border-slate-300

          shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]
        "
        >
          Soon
        </div>
      )}

    </div>
  );
}
