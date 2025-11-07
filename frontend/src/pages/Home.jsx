import { useState, useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import Navbar from "../components/Navbar";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    const user = localStorage.getItem("user");
    setUserName(user?.split(" ")[0] || "");
  }, []);


  const backgroundStyle = {
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textAlign: "center",
    fontFamily: "'Roboto Mono', monospace",
    overflow: "hidden",
    position: "relative",
  };


  return (
    <div style={backgroundStyle}>
      <Navbar />
      
      <div
        className="text-center"
        style={{
          animation: "fadeInUp 1.2s ease-out forwards",
          marginTop: "60px",
        }}
      >
        <h1
          className="fw-bold display-5 mb-3"
          style={{
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            opacity: 0,
            animation: "fadeIn 1.5s ease-in forwards",
          }}
        >
          {loggedIn ? (
            <>
              Welcome back,{" "}
              <span className="text-warning">{userName || "User"}</span> 👋
            </>
          ) : (
            <>
              Welcome to <span className="text-warning">TaskSphere</span> 🚀
            </>
          )}
        </h1>

        <p
          className="lead opacity-75 mb-5"
          style={{
            opacity: 0,
            animation: "slideUp 1.8s ease-out 0.5s forwards",
          }}
        >
          {loggedIn
            ? "Ready to manage your projects efficiently?"
            : "Organize. Collaborate. Achieve your goals efficiently."}
        </p>

        <div
          className="d-flex gap-4 justify-content-center"
          style={{
            opacity: 0,
            animation: "fadeIn 2.2s ease-out 1s forwards",
          }}
        >
        </div>
      </div>

      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn:hover {
          filter: brightness(1.05);
        }
      `}
      </style>
    </div>
  );
};

export default Home;
