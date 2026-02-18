export default function ExamCategorySection({
  title,
  description,
  exams,
  onExamClick
}) {
  if (!exams.length) return null;

  const createRipple = (e) => {
    const card = e.currentTarget;
    const circle = document.createElement("span");

    const diameter = Math.max(card.clientWidth, card.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - card.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - card.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = card.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    card.appendChild(circle);
  };

  return (
    <section className="mb-12">

      {/* Section Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[#0f0f1a] dark:text-white">
          {title}
        </h3>

        <p className="text-xs text-[#6a6a9a] dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>


      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

        {exams.map(exam => (
          <div
            key={exam.id}
            onClick={(e) => {
              createRipple(e);
              setTimeout(() => onExamClick(exam), 150);
            }}

            className="exam-card relative overflow-hidden cursor-pointer rounded-lg p-4 transition-all duration-200"
          >

            {/* Popularity badge */}
            {exam.popularity && (
              <span className="
                absolute top-2 right-2 text-[9px] font-semibold
                bg-gradient-to-b from-white to-gray-100
                dark:from-[#2a2a40] dark:to-[#1a1a2e]
                text-primary px-2 py-[2px] rounded-full
                shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.7)]
              ">
                🔥 {exam.popularity}
              </span>
            )}


            {/* Icon */}
            <div className="
              mb-3 w-10 h-10 rounded-md flex items-center justify-center
              text-primary
              bg-gradient-to-b from-white to-gray-200
              dark:from-[#2a2a40] dark:to-[#1a1a2e]
              shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.6)]
            ">
              <span className="material-symbols-outlined text-[20px]">
                {exam.icon}
              </span>
            </div>


            {/* Title */}
            <h4 className="font-semibold text-sm text-[#0f0f1a] dark:text-white">
              {exam.type}
            </h4>


            {/* Exam list */}
            <p className="text-[11px] text-[#6a6a9a] dark:text-gray-400 mt-[2px] leading-relaxed">
              {exam.exams.join(", ")}
            </p>

          </div>
        ))}

      </div>


      {/* Skeuomorphic Card CSS */}
      <style jsx>{`

        .exam-card {

          background: linear-gradient(145deg, #ffffff, #e6e9ef);

          box-shadow:
            6px 6px 12px rgba(0,0,0,0.12),
            -6px -6px 12px rgba(255,255,255,0.9),
            inset 0 1px 0 rgba(255,255,255,0.8);

          border: 1px solid rgba(0,0,0,0.05);
        }


        .dark .exam-card {

          background: linear-gradient(145deg, #1f2235, #161827);

          box-shadow:
            6px 6px 12px rgba(0,0,0,0.6),
            -4px -4px 8px rgba(255,255,255,0.05),
            inset 0 1px 0 rgba(255,255,255,0.05);

          border: 1px solid rgba(255,255,255,0.04);
        }


        /* Hover — lifted */
        .exam-card:hover {

          box-shadow:
            8px 8px 16px rgba(0,0,0,0.16),
            -8px -8px 16px rgba(255,255,255,0.95),
            inset 0 1px 0 rgba(255,255,255,0.9);

          transform: translateY(-2px);
        }


        /* Pressed */
        .exam-card:active {

          box-shadow:
            inset 4px 4px 8px rgba(0,0,0,0.2),
            inset -4px -4px 8px rgba(255,255,255,0.8);

          transform: translateY(0px) scale(0.98);
        }


        /* Ripple */
        .ripple {

          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms linear;
          background-color: rgba(30, 30, 138, 0.2);
          pointer-events: none;
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

      `}</style>

    </section>
  );
}
