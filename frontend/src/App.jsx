import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MicCheck from "./pages/MicCheck";
import Recorder from "./pages/Recorder";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/mic-check"
          element={
            <ProtectedRoute>
              <MicCheck />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recorder"
          element={
            <ProtectedRoute>
              <Recorder/>
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}
