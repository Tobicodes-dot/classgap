import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";


import Login from "./pages/Login";

// Admin Portal
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Classes from "./pages/admin/Classes";
import Teachers from "./pages/admin/Teachers";
import Students from "./pages/admin/Students";
import Subjects from "./pages/admin/Subjects";
import Topics from "./pages/admin/Topics";
import Assessments from "./pages/admin/Assessments";
import StudentProgress from "./pages/admin/StudentProgress";

// Teacher Portal
import TeacherLayout from "./components/TeacherLayout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherAssessments from "./pages/teacher/TeacherAssessments";
import TeacherLearningGaps from "./pages/teacher/TeacherLearningGaps";
import TeacherInterventions from "./pages/teacher/TeacherInterventions";
import TeacherStudentProgress from "./pages/teacher/TeacherStudentProgress";

// Student Portal
import StudentLayout from "./components/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAssessments from "./pages/student/StudentAssessments";
import TakeTest from "./pages/student/TakeTest";
import StudentProgressView from "./pages/student/StudentProgressView";
import StudentInterventionsView from "./pages/student/StudentInterventionsView";

function HomeRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-300">Loading ClassGap...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "teacher") return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Landing Route */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<HomeRedirect />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="classes" element={<Classes />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="students" element={<Students />} />
              <Route path="subjects" element={<Subjects />} />
              <Route path="topics" element={<Topics />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="students/:id/progress" element={<StudentProgress />} />
            </Route>
          </Route>

          {/* Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={["teacher", "admin"]} />}>
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<Navigate to="/teacher/dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="assessments" element={<TeacherAssessments />} />
              <Route path="learning-gaps" element={<TeacherLearningGaps />} />
              <Route path="interventions" element={<TeacherInterventions />} />
              <Route path="students" element={<TeacherStudentProgress />} />
              <Route path="students/:id/progress" element={<TeacherStudentProgress />} />
              <Route path="students/:id/gaps" element={<TeacherLearningGaps />} />
            </Route>
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="assessments" element={<StudentAssessments />} />
              <Route path="take-test/:id" element={<TakeTest />} />
              <Route path="progress" element={<StudentProgressView />} />
              <Route path="interventions" element={<StudentInterventionsView />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;