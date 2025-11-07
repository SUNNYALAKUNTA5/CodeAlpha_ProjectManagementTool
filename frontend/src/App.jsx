import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectBoard from "./pages/ProjectBoard";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import Home from "./pages/Home";
import Error from "./pages/Error";
import { getAuthToken } from "./utils/auth";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/projects/:projectId" 
          element={
            <ProtectedRoute> 
              <ProjectBoard />
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
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
};

export default App;
