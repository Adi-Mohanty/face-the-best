import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ExamSelection from "./pages/ExamSelection";
import SubjectSelection from "./pages/SubjectSelection";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Review from "./pages/Review";

import AdminExams from "./pages/admin/AdminExams";
import AdminSubjects from "./pages/admin/AdminSubjects";

import Unauthorized from "./pages/Unauthorized";
import Welcome from "./pages/Welcome";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AppLayout from "./components/layout/AppLayout";
import PublicLayout from "./components/layout/PublicLayout";
import QuestionsDashboard from "./pages/admin/QuestionsDashboard";
import GenerateQuestions from "./pages/admin/GenerateQuestions";
import ManualAddQuestions from "./pages/admin/ManualAddQuestions";


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
        {/* <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <AdminQuestions />
            </AdminRoute>
          }
        /> */}

        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <QuestionsDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/questions/generate"
          element={
            <AdminRoute>
              <GenerateQuestions />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/questions/manual"
          element={
            <AdminRoute>
              <ManualAddQuestions />
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
