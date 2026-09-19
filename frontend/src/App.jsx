import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

function App(){
  const token = localStorage.getItem("token");

    return (
        <BrowserRouter>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin-dashboard" element={token ? <AdminDashboard /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
    )
}

export default App;