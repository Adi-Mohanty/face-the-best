import { Link } from "react-router-dom";

export default function DevNavBar() {
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-white shadow-lg border border-gray-200">
      <div className="flex flex-col gap-1 p-3 text-sm">
        <Link
          to="/login"
          className="text-blue-600 hover:underline"
        >
          Login
        </Link>

        <Link
          to="/exams"
          className="text-blue-600 hover:underline"
        >
          Exams
        </Link>

        <Link
          to="/categories"
          className="text-blue-600 hover:underline"
        >
          Categories
        </Link>

        <Link
          to="/instructions"
          className="text-blue-600 hover:underline"
        >
          Instructions
        </Link>

        <Link
          to="/quiz"
          className="text-blue-600 hover:underline"
        >
          Quiz
        </Link>

        <Link
          to="/result"
          className="text-blue-600 hover:underline"
        >
          Result
        </Link>

        <Link
          to="/review"
          className="text-blue-600 hover:underline"
        >
          Review
        </Link>

        <Link
          to="/admin"
          className="text-blue-600 hover:underline"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}
