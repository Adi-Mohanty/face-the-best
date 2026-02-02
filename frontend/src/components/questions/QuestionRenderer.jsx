import MCQQuestion from "./MCQQuestion";
import StatementQuestion from "./StatementQuestion";
import AssertionReasonQuestion from "./AssertionReasonQuestion";
import PassageQuestion from "./PassageQuestion";

export default function QuestionRenderer({
  question,
  userAnswer,
  onSelect,
  mode
}) {
  const commonProps = {
    question,
    userAnswer,
    onSelect,
    mode,
    disabled: mode === "review"
  };

  switch (question.type) {
    case "MCQ":
      return <MCQQuestion {...commonProps} />;

    case "STATEMENT":
      return <StatementQuestion {...commonProps} />;

    case "ASSERTION_REASON":
      return <AssertionReasonQuestion {...commonProps} />;

    case "PASSAGE":
      return <PassageQuestion {...commonProps} />;

    default:
      return (
        <p className="text-red-500 font-bold">
          Unsupported question type: {question.type}
        </p>
      );
  }
}