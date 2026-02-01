import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ExamSelection from "./pages/ExamSelection";
import CategorySelection from "./pages/CategorySelection";
import Instructions from "./pages/Instructions";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Review from "./pages/Review";
import Admin from "./pages/Admin";

import DevNavBar from "./components/DevNavBar";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/exams" element={<ExamSelection />} />
        <Route path="/categories" element={<CategorySelection />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/review" element={<Review />} />

        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* 🔧 Temporary Dev Navigation */}
      <DevNavBar />
    </>
  );
}
