export default function AssertionReasonQuestion({
  question,
  userAnswer,
  onSelect,
  mode
}) {
  const isReview = mode === "review";

  return (
    <>
      {/* Assertion */}
      <div className="mb-4">
        <p className="text-sm font-bold uppercase text-slate-500 mb-1">
          Assertion (A)
        </p>
        <p className="text-lg font-medium">
          {question.assertion}
        </p>
      </div>

      {/* Reason */}
      <div className="mb-6">
        <p className="text-sm font-bold uppercase text-slate-500 mb-1">
          Reason (R)
        </p>
        <p className="text-lg font-medium">
          {question.reason}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {question.options.map((opt, i) => {
          const isUser = userAnswer === i;
          const isCorrect = question.correctOption === i;

          let styles =
            "border-slate-200 hover:border-slate-300";

          if (isReview) {
            if (isCorrect) {
              styles = "border-success-border bg-success-bg/30";
            } else if (isUser && !isCorrect) {
              styles = "border-error-border bg-error-bg/30";
            }
          } else if (isUser) {
            styles = "border-primary bg-primary/5";
          }

          return (
            <label
              key={i}
              onClick={() => !isReview && onSelect(i)}
              className={`
                relative flex items-center justify-between
                px-4 py-3
                rounded-lg border
                text-sm font-medium
                transition-all duration-150
                select-none
                ${
                  isReview
                    ? "cursor-default"
                    : "cursor-pointer hover:scale-[1.01]"
                }
                ${
                  isReview
                    ? isCorrect
                      ? "bg-emerald-50 border-emerald-400"
                      : isUser && !isCorrect
                      ? "bg-red-50 border-red-400"
                      : "bg-gradient-to-b from-white to-slate-200 border-slate-300"
                    : isUser
                    ? `
                      bg-gradient-to-b from-primary/90 to-primary
                      text-white
                      border-primary
                      shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]
                    `
                    : `
                      bg-gradient-to-b from-white to-slate-200
                      border-slate-300
                      shadow-[4px_4px_8px_rgba(0,0,0,0.08),_-3px_-3px_6px_rgba(255,255,255,0.9)]
                    `
                }
                ${
                  !isReview &&
                  "active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15)] active:translate-y-[1px]"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    w-4 h-4 rounded-full border
                    flex items-center justify-center
                    transition-all duration-150
                    ${
                      isUser
                        ? "bg-white border-white"
                        : "bg-gradient-to-b from-white to-slate-200 border-slate-400"
                    }
                  `}
                >
                  {isUser && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  )}
                </div>

                <span>{opt}</span>
              </div>

              {isReview && isCorrect && (
                <span className="text-success-border font-bold text-xs uppercase flex items-center gap-1">
                  Correct
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                </span>
              )}

              {isReview && isUser && !isCorrect && (
                <span className="text-error-border font-bold text-xs uppercase flex items-center gap-1">
                  Your Choice
                  <span className="material-symbols-outlined text-sm">
                    cancel
                  </span>
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Explanation */}
      {isReview && question.explanation && (
        <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">lightbulb</span>
            Explanation
          </h4>
          <p className="text-sm">{question.explanation}</p>
        </div>
      )}
    </>
  );
}