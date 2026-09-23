
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Classes from "./pages/admin/Classes";
import Teachers from "./pages/admin/Teachers";
import Students from "./pages/admin/Students";
import Subjects from "./pages/admin/Subjects";
import Topics from "./pages/admin/Topics";

function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/admin"
          element={
            token ? (
              <AdminLayout />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="classes" element={<Classes />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/subjects" element={<Subjects />} />
          <Route path="/admin/topics" element={<Topics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;