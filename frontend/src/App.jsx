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
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <>
      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* 🔥 USER LAYOUT WRAPPER */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/exams" element={<ExamSelection />} />
          <Route path="/subjects" element={<SubjectSelection />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result/:attemptId" element={<Result />} />
          <Route path="/review/:attemptId" element={<Review />} />
        </Route>

        {/* 🔥 ADMIN (NO APP LAYOUT) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/exams"
          element={
            <AdminRoute>
              <AdminExams />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/subjects"
          element={
            <AdminRoute>
              <AdminSubjects />
            </AdminRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>


      {/* 🔧 Temporary Dev Navigation */}
      {/* <DevNavBar /> */}
    </>
  );
}
