import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ExamSelection from "./pages/ExamSelection";
import SubjectSelection from "./pages/SubjectSelection";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Review from "./pages/Review";

import AdminExams from "./pages/AdminExams";
import AdminSubjects from "./pages/AdminSubjects";

import Unauthorized from "./pages/Unauthorized";
import Welcome from "./pages/Welcome";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AppLayout from "./components/layout/AppLayout";
import PublicLayout from "./components/layout/PublicLayout";
import AdminQuestions from "./pages/AdminQuestons";


export default function App() {

  return (

    <Routes>

      {/* PUBLIC */}
      <Route element={<PublicLayout />}>

        <Route path="/" element={<Welcome />} />

        <Route path="/login" element={<Login />} />

      </Route>



      {/* APP LAYOUT (Navbar included here) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        {/* USER ROUTES */}
        <Route path="/exams" element={<ExamSelection />} />

        <Route path="/subjects" element={<SubjectSelection />} />

        <Route path="/quiz" element={<Quiz />} />

        <Route path="/result/:attemptId" element={<Result />} />

        <Route path="/review/:attemptId" element={<Review />} />



        {/* ADMIN ROUTES INSIDE SAME LAYOUT */}
        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <AdminQuestions />
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

      </Route>



      {/* UNAUTHORIZED */}
      <Route path="/unauthorized" element={<Unauthorized />} />


      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>

  );

}
