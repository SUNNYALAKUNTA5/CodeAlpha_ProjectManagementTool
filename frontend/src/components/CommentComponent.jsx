import { useEffect, useState } from "react";
import axios from "axios";
import ToastNotification from "../components/ToastNotification";

const CommentsModal = ({ task, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/task/${task._id}`);
      setComments(res.data);
    } catch (err) {
      setToast({ show: true, message: "Failed to fetch comments", type: "error" });
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`/api/comments`, {
        text: newComment,
        taskId: task._id,
      });
      setComments([...comments, res.data]);
      setNewComment("");
      setToast({ show: true, message: "Comment added!", type: "success" });
    } catch (err) {
      setToast({ show: true, message: "Error adding comment", type: "error" });
    }
  };

  const deleteComment = async (id) => {
    try {
      await axios.delete(`/api/comments/${id}`);
      setComments(comments.filter((c) => c._id !== id));
      setToast({ show: true, message: "Comment deleted!", type: "warning" });
    } catch (err) {
      setToast({ show: true, message: "Error deleting comment", type: "error" });
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.65)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    animation: "fadeIn 0.3s ease-in-out",
  };

  const modalStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    borderRadius: "1.2rem",
    padding: "25px",
    width: "500px",
    color: "white",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    position: "relative",
    maxHeight: "80vh",
    overflowY: "auto",
    animation: "popUp 0.25s ease-out",
  };

  const closeBtnStyle = {
    position: "absolute",
    top: "12px",
    right: "15px",
    fontSize: "1.3rem",
    color: "#ffc107",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    borderRadius: "1rem",
    padding: "12px 18px",
    marginBottom: "15px",
    fontWeight: "600",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  };

  const commentBoxStyle = {
    maxHeight: "260px",
    overflowY: "auto",
    marginBottom: "15px",
  };

  const commentStyle = {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "10px 14px",
    marginBottom: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  };

  const inputStyle = {
    borderRadius: "8px",
    padding: "10px",
    border: "1px solid rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "white",
    outline: "none",
    flex: 1,
  };

  const buttonStyle = {
    borderRadius: "8px",
    backgroundColor: "#ffc107",
    color: "#333",
    fontWeight: "600",
    border: "none",
    padding: "10px 16px",
    transition: "all 0.3s ease",
  };

  return (
    <>
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <button
            style={closeBtnStyle}
            onMouseEnter={(e) => (e.target.style.transform = "rotate(90deg)")}
            onMouseLeave={(e) => (e.target.style.transform = "rotate(0deg)")}
            onClick={onClose}
          >
            ✖
          </button>

          <div style={headerStyle}>
            Comments for <span className="text-warning">{task.title}</span>
          </div>

          <div style={commentBoxStyle}>
            {comments.length === 0 ? (
              <p className="text-center opacity-75">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} style={commentStyle}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong>{c.user?.name || "User"}</strong>
                    <button
                      onClick={() => deleteComment(c._id)}
                      className="btn btn-outline-danger btn-sm py-0 px-2"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="mb-1 small">{String(c.text).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={addComment}
            className="d-flex align-items-center gap-2 mt-3"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={inputStyle}
            />
            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#e0a800")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffc107")}
            >
              Add
            </button>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        show={toast.show}
        setShow={(val) => setToast({ ...toast, show: val })}
      />

      {/* Animations */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        `}
      </style>
    </>
  );
};

export default CommentsModal;
