export default function StatementQuestion({
  question,
  userAnswer,
  onSelect,
  mode
}) {
  const isReview = mode === "review";

  return (
    <>
      {/* Question */}
      <p className="text-lg md:text-xl font-medium leading-relaxed mb-8">
        {question.question}
      </p>

      {/* Statements */}
      <div className="space-y-3 mb-8">
        {question.statements.map((s, i) => (
          <p key={i} className="flex gap-4">
            <span className="font-bold">{i + 1}.</span>
            {s}
          </p>
        ))}
      </div>

      <p className="font-bold mb-6">
        Which of the statements given above is/are correct?
      </p>

      {/* Options */}
      <div className="space-y-4">
      {question.options.map((opt, i) => {
        const isUser = userAnswer === i;
        const isCorrect = question.correctOption === i;

        let styles = "border-slate-200 hover:border-slate-300";

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

      {/* Right-side status badge */}
      {isReview && isCorrect && (
        <span className="flex items-center gap-1 text-success-border font-bold text-xs uppercase">
          Correct
          <span className="material-symbols-outlined text-sm">
            check_circle
          </span>
        </span>
      )}

      {isReview && isUser && !isCorrect && (
        <span className="flex items-center gap-1 text-error-border font-bold text-xs uppercase">
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
          <h4 className="font-bold text-primary mb-2">Explanation</h4>
          <p className="text-sm">{question.explanation}</p>
        </div>
      )}
    </>
  );
}
