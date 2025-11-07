import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { removeAuthToken, isAuthenticated } from "../utils/auth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [userName, setUserName] = useState("");

  const isHome = location.pathname === "/";
  const isTask = location.pathname.startsWith("/projects/");

  const handleLogout = () => {
    removeAuthToken();
    setLoggedIn(false);
    setUserName("");
    navigate("/login");
  };

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    const user = localStorage.getItem("user");
    setUserName(user?.split(" ")[0] || "");
  }, [location.pathname]);

  const navbarStyle = {
    background: isHome
      ? "rgba(255, 255, 255, 0.1)"
      : "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    zIndex: 1000,
  };

  const buttonHover = (id) => ({
    transform: hovered === id ? "translateY(-2px)" : "translateY(0)",
    boxShadow:
      hovered === id
        ? "0 4px 10px rgba(0, 0, 0, 0.25)"
        : "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  });

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark ${
        isHome ? "position-absolute top-0 w-100" : "shadow-sm"
      }`}
      style={navbarStyle}
    >
      <div className="container-fluid px-4">
        {/* Brand + Back */}
        <div className="d-flex align-items-center">
          {isTask && (
            <button
              className="btn btn-sm btn-link text-white me-2 p-0"
              onClick={() => navigate("/dashboard")}
              style={{ fontSize: "1.3rem", textDecoration: "none" }}
            >
              ←
            </button>
          )}
          <Link to="/" className="navbar-brand fw-bold fs-4 text-white">
            TaskSphere
          </Link>
        </div>

        {/* Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span
            className="navbar-toggler-icon"
            style={{ filter: "brightness(0) invert(1)" }}
          ></span>
        </button>

        {/* Center Nav */}
        <div
          className={`collapse navbar-collapse justify-content-center ${
            isCollapsed ? "" : "show"
          }`}
        >
          <ul
            className="navbar-nav d-flex align-items-center mb-0"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            {!loggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-outline-light px-4 fw-semibold rounded-pill"
                    style={buttonHover("login")}
                    onMouseEnter={() => setHovered("login")}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setIsCollapsed(true)}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="btn btn-warning px-4 fw-semibold text-dark rounded-pill"
                    style={buttonHover("register")}
                    onMouseEnter={() => setHovered("register")}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setIsCollapsed(true)}
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/dashboard"
                    className="nav-link text-white fw-semibold"
                    style={{ fontSize: "1.05rem" }}
                    onClick={() => setIsCollapsed(true)}
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item d-flex align-items-center gap-2 text-white">
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                      color: "#ffc107",
                      fontSize: "1rem",
                    }}
                  >
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="fw-semibold d-none d-md-inline opacity-75">
                    {userName}
                  </span>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-warning px-4 fw-semibold text-dark rounded-pill"
                    style={buttonHover("logout")}
                    onMouseEnter={() => setHovered("logout")}
                    onMouseLeave={() => setHovered(null)}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <style>
        {`
        .navbar-toggler-icon {
  filter: brightness(0) invert(1);
}

.navbar-collapse.show {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
        `}
      </style>
    </nav>
  );
};

export default Navbar;
