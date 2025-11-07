import { useEffect } from "react";

const ToastNotification = ({ message, type = "success", show, setShow }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000); // auto close after 3s
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  const bgColor =
    type === "success"
      ? "bg-success text-white"
      : type === "error"
      ? "bg-danger text-white"
      : "bg-warning text-dark";

  return (
    <div
      className={`toast show position-fixed top-0 end-0 m-4 ${bgColor}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        zIndex: 2000,
        borderRadius: "0.75rem",
        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
        minWidth: "250px",
      }}
    >
      <div className="toast-body fw-semibold text-center">
        {message}
      </div>
    </div>
  );
};

export default ToastNotification;
