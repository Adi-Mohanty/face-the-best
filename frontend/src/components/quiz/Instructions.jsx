import { useState } from "react";

export default function InstructionsModal({ onConfirm }) {

  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">

      <div
        className="
        w-[900px] max-h-[90vh]
        rounded-3xl overflow-hidden

        bg-gradient-to-b from-white to-slate-200
        border border-slate-300

        shadow-[20px_20px_40px_rgba(0,0,0,0.3),_-10px_-10px_20px_rgba(255,255,255,0.95)]

        flex flex-col
      "
      >

        {/* Header */}
        <div
          className="
          px-8 py-5

          bg-gradient-to-b from-white to-slate-200
          border-b border-slate-300

          shadow-[inset_0_-2px_4px_rgba(0,0,0,0.08)]
        "
        >

          <h2 className="text-2xl font-black text-slate-800">
            Quiz Instructions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Prepare yourself before entering the arena
          </p>

        </div>


        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">


          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">

            {[
              ["quiz", "Questions", "10"],
              ["timer", "Duration", "10 Minutes"],
              ["military_tech", "Marks", "10"],
            ].map(([icon, label, value]) => (

              <div
                key={label}
                className="
                rounded-xl px-4 py-4

                bg-gradient-to-b from-white to-slate-200
                border border-slate-300

                shadow-[6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_8px_rgba(255,255,255,0.95)]
              "
              >

                <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold">

                  <span className="material-symbols-outlined text-primary">
                    {icon}
                  </span>

                  {label}

                </div>

                <p className="text-lg font-bold mt-1 text-slate-800">
                  {value}
                </p>

              </div>

            ))}

          </div>


          {/* Instructions */}
          <div
            className="
            rounded-xl

            bg-gradient-to-b from-white to-slate-200
            border border-slate-300

            shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15)]
          "
          >

            <div className="px-6 py-4 border-b border-slate-300">

              <h3 className="font-bold text-primary">
                Arena Rules
              </h3>

            </div>


            <div className="px-6 py-4 space-y-4">

              {[
                ["check_circle", "Each question carries 2 marks"],
                ["check_circle", "No negative marking"],
                ["info", "Timer starts immediately"],
                ["warning", "Auto submission on timeout"],
                ["block", "Avoid tab switching"],
              ].map(([icon, text], i) => (

                <div key={i} className="flex gap-3">

                  <span className="material-symbols-outlined text-primary">
                    {icon}
                  </span>

                  <p className="text-sm text-slate-700">
                    {text}
                  </p>

                </div>

              ))}

            </div>

          </div>


          {/* Checkbox */}
          <label className="flex items-center gap-3 mt-8 cursor-pointer">

            <input
              type="checkbox"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
              className="
              w-5 h-5 rounded

              bg-gradient-to-b from-white to-slate-200
              border border-slate-400

              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
            "
            />

            <span className="text-sm font-semibold text-slate-700">
              I am ready to compete.
            </span>

          </label>

        </div>


        {/* Footer */}
        <div
          className="
          px-8 py-5

          bg-gradient-to-b from-white to-slate-200
          border-t border-slate-300

          flex justify-end
        "
        >

          <button
            disabled={!accepted}
            onClick={onConfirm}
            className={`
              px-8 py-3 rounded-xl font-bold

              transition-all duration-150

              ${
                accepted
                  ? `
                  bg-gradient-to-b from-primary to-blue-600
                  border border-blue-700
                  text-white

                  shadow-[0_10px_20px_rgba(79,70,229,0.45)]

                  active:translate-y-[2px]
                  active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)]
                  `
                  : `
                  bg-gradient-to-b from-white to-slate-200
                  border border-slate-300
                  text-slate-400
                  shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15)]
                  `
              }
            `}
          >
            Enter Arena
          </button>

        </div>

      </div>

    </div>
  );
}
