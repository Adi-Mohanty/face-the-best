import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ExamSelection from "./pages/ExamSelection";
import SubjectSelection from "./pages/SubjectSelection";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Review from "./pages/Review";
import Admin from "./pages/Admin";

import DevNavBar from "./components/DevNavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminExams from "./pages/AdminExams";
import AdminSubjects from "./pages/AdminSubjects";
import AdminRoute from "./components/AdminRoute";
import Unauthorized from "./pages/Unauthorized";
import Welcome from "./pages/Welcome";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/welcome" element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>}
        />
        <Route path="/exams" element={
          <ProtectedRoute>
            <ExamSelection />
          </ProtectedRoute>} />
        <Route path="/subjects" element={
          <ProtectedRoute>
            <SubjectSelection />
          </ProtectedRoute>} />
        <Route path="/quiz" element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>} />
        <Route path="/result" element={
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>} />
        <Route path="/review" element={
          <ProtectedRoute>
            <Review />  
          </ProtectedRoute>} />

        <Route path="/admin" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>} />

        <Route path="/admin/exams" element={
          <AdminRoute>
            <AdminExams />
          </AdminRoute>} />

        <Route path="/admin/subjects" element={
          <AdminRoute>
            <AdminSubjects />
          </AdminRoute>} />


          <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>


      {/* 🔧 Temporary Dev Navigation */}
      <DevNavBar />
    </>
  );
}
