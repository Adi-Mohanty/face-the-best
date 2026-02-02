export default function PassageQuestion({
  question,
  userAnswer,
  onSelect,
  mode
}) {
  const isReview = mode === "review";

  return (
    <>
      {/* Passage */}
      <div className="mb-6 p-6 bg-slate-50 rounded-xl border">
        <p className="text-sm font-bold uppercase mb-2 text-slate-500">
          Passage
        </p>
        <p className="text-base leading-relaxed">
          {question.passage}
        </p>
      </div>

      {/* Question */}
      <p className="text-lg font-medium mb-6">
        {question.question}
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
              className={`flex items-center justify-between p-5 border-2 rounded-xl transition ${
                isReview ? "cursor-default" : "cursor-pointer"
              } ${styles}`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  checked={isUser}
                  onChange={() => !isReview && onSelect(i)}
                  disabled={isReview}
                />
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
