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
      <section className="mb-16">
        <div className="mb-6">
          <h3 className="text-2xl font-black">{title}</h3>
          <p className="text-sm text-[#555591] dark:text-gray-400">
            {description}
          </p>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {exams.map(exam => {  
            return (
              <div
                key={exam.id}
                onClick={(e) => {
                    createRipple(e);
                    setTimeout(() => onExamClick(exam), 180);
                }}
                className="relative overflow-hidden cursor-pointer p-6 rounded-xl border
                       bg-white dark:bg-[#1a1a2e]
                       hover:shadow-lg hover:-translate-y-1
                       active:scale-[0.98] transition-all"
              >
                {/* Popularity badge */}
                {exam.popularity && (
                <span className="absolute top-3 right-3 text-[10px] font-bold
                                bg-primary/10 text-primary px-2 py-1 rounded-full">
                    🔥 {exam.popularity}
                </span>
                )}

                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    {exam.icon}
                  </span>
                </div>
  
                <h4 className="font-bold">{exam.type}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {exam.exams.join(", ")}
                </p>
              </div>
            );
          })}
        </div>

        {/* Ripple CSS */}
        <style jsx>{`
            .ripple {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 600ms linear;
            background-color: rgba(30, 30, 138, 0.25);
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
  