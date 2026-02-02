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