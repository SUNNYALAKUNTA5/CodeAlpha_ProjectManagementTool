import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../utils/auth";
import ToastNotification from "../components/ToastNotification";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password }
      );
      setAuthToken(res.data.token);
      localStorage.setItem("user", res.data.user.name);
      setToast({ show: true, message: "Login successful!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
       setToast({
        show: true,
        message: error.response?.data?.message || "Login failed",
        type: "error",
      });
      setEmail("");
      setPassword("");
    }
  };

  const pageStyle = {
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Roboto Mono', monospace",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    padding: "2.5rem",
    borderRadius: "1.5rem",
    width: "350px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    color: "white",
    textAlign: "center",
  };

  const inputStyle = {
    borderRadius: "8px",
    padding: "10px",
    border: "1px solid rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "white",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s ease",
  };

  // 🌈 Match input focus color to theme (no bright white)
  const inputFocus = (e) => {
    e.target.style.borderColor = "#9d7dff"; // soft violet border
    e.target.style.backgroundColor = "rgba(157, 125, 255, 0.25)"; // subtle purple tint
    e.target.style.boxShadow = "0 0 8px rgba(157, 125, 255, 0.6)";
  };

  const inputBlur = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.25)";
    e.target.style.backgroundColor = "rgba(255,255,255,0.12)";
    e.target.style.boxShadow = "none";
  };

  const buttonStyle = {
    borderRadius: "8px",
    padding: "10px",
    fontWeight: "600",
    backgroundColor: "#ffc107",
    border: "none",
    color: "#333",
    transition: "all 0.3s ease",
  };

  const buttonHover = (e, isHover) => {
    e.target.style.backgroundColor = isHover ? "#e0a800" : "#ffc107";
    e.target.style.transform = isHover ? "translateY(-2px)" : "translateY(0)";
  };

  return (
    <>
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2 className="fw-bold mb-4">Login to TaskSphere</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={inputFocus}
              onBlur={inputBlur}
              required
              style={inputStyle}
              autoFocus
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={inputFocus}
              onBlur={inputBlur}
              required
              style={inputStyle}
            />
            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={(e) => buttonHover(e, true)}
              onMouseLeave={(e) => buttonHover(e, false)}
            >
              Login
            </button>
          </form>

          <div className="mt-3">
            <small>
              Don’t have an account?{" "}
              <Link to="/register" style={{ color: "#ffc107", fontWeight: "600" }}>
                Register
              </Link>
            </small>
          </div>
        </div>
      </div>

      <ToastNotification
        message={toast.message}
        type={toast.type}
        show={toast.show}
        setShow={(val) => setToast({ ...toast, show: val })}
      />
    </>
  );
};

export default Login;