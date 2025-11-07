import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommentsModal from "../components/CommentComponent";
import Navbar from "../components/Navbar";
import ToastNotification from "../components/ToastNotification";

function ProjectBoard() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const statuses = ["todo", "in-progress", "done"];

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}`);
      setProject(res.data);
    } catch {
      setToast({ show: true, message: "Failed to load project!", type: "error" });
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/tasks/project/${projectId}`);
      setTasks(res.data);
    } catch {
      setToast({ show: true, message: "Failed to fetch tasks!", type: "error" });
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      const res = await axios.post(`/api/tasks`, {
        ...newTask,
        project: projectId,
        assignedTo: null,
      });
      setTasks([...tasks, res.data]);
      setNewTask({ title: "", description: "" });
      setToast({ show: true, message: "Task created successfully!", type: "success" });
    } catch {
      setToast({ show: true, message: "Failed to create task!", type: "error" });
    }
  };

  const updateStatus = async (taskId, newStatus, showToast = true) => {
    try {
      const res = await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
      if (showToast) setToast({ show: true, message: "Task updated!", type: "success" });
    } catch {
      setToast({ show: true, message: "Failed to update task!", type: "error" });
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      setToast({ show: true, message: "Task deleted!", type: "warning" });
    } catch {
      setToast({ show: true, message: "Failed to delete task!", type: "error" });
    }
  };

  const onDragStart = (e, task) => {
    setDraggedTask(task);
    e.currentTarget.style.opacity = "0.5";
  };

  const onDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedTask(null);
    setDropTarget(null);
  };

  const onDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      updateStatus(draggedTask._id, status, false);
      setTasks(tasks.map((t) => (t._id === draggedTask._id ? { ...t, status } : t)));
      setToast({ show: true, message: `Moved to ${status}`, type: "info" });
      setDropTarget(status);
      setTimeout(() => setDropTarget(null), 600);
    }
  };

  const allowDrop = (e) => e.preventDefault();

  // 💜 Page style
  const pageStyle = {
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    minHeight: "100vh",
    color: "white",
    fontFamily: "'Roboto Mono', monospace",
  };

  const columnStyle = {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
    borderRadius: "1rem",
    padding: "1.5rem",
    minHeight: "400px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  };

  const badgeColors = {
    todo: "bg-secondary",
    "in-progress": "bg-info text-dark",
    done: "bg-success",
  };

  return (
    <>
      <Navbar />
      <div style={pageStyle} className="py-5">
        <div className="container">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-light mb-0">
              Project: <span className="text-warning">{project?.title}</span>
            </h2>
            <button
              className="btn btn-warning fw-semibold rounded-pill shadow-sm"
              data-bs-toggle="modal"
              data-bs-target="#createTaskModal"
            >
              + New Task
            </button>
          </div>

          {/* Task Columns */}
          <div className="row g-4">
            {statuses.map((status) => (
              <div
                key={status}
                className={`col-md-4 column-dropzone ${dropTarget === status ? "pulse" : ""}`}
                onDragOver={allowDrop}
                onDrop={(e) => onDrop(e, status)}
              >
                <div style={columnStyle} className="h-100">
                  <h4 className="fw-bold text-capitalize mb-3">{status}</h4>

                  {tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <div
                        key={task._id}
                        className={`task-card status-${task.status}`}
                        draggable
                        onDragStart={(e) => onDragStart(e, task)}
                        onDragEnd={onDragEnd}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>{task.title}</strong>
                          <span className={`badge ${badgeColors[task.status]}`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="small text-light opacity-75 mb-2">
                          {task.description || "No description"}
                        </p>

                        <div className="d-flex flex-wrap gap-2 justify-content-end">
                          <select
                            value={task.status}
                            onChange={(e) => updateStatus(task._id, e.target.value)}
                            className="custom-select-status"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setSelectedTask(task)}
                            className="btn btn-outline-light btn-sm"
                          >
                            💬
                          </button>
                          <button
                            onClick={() => deleteTask(task._id)}
                            className="btn btn-outline-danger btn-sm"
                            aria-label="Delete Task"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}

                  {tasks.filter((t) => t.status === status).length === 0 && (
                    <p className="text-center text-light opacity-50 small">
                      No tasks yet
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Modal for New Task */}
          <div
            className="modal fade"
            id="createTaskModal"
            tabIndex="-1"
            aria-labelledby="createTaskModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-light rounded-4">
                <div className="modal-header border-0">
                  <h5 className="modal-title" id="createTaskModalLabel">
                    Create New Task
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <form onSubmit={createTask}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask({ ...newTask, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        placeholder="Optional description"
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask({ ...newTask, description: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button
                      type="submit"
                      className="btn btn-warning fw-semibold px-4 rounded-pill"
                      data-bs-dismiss="modal"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {selectedTask && (
            <CommentsModal
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
            />
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        show={toast.show}
        setShow={(val) => setToast({ ...toast, show: val })}
      />

      <style>
{`
  /* 🧊 Task Cards */
  .task-card {
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    position: relative;
    transition: transform 0.25s ease, opacity 0.3s ease;
    animation: fadeSlideIn 0.4s ease;
  }

  .task-card::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    border-radius: 10px 0 0 10px;
  }

  .task-card.status-todo::before {
    background: linear-gradient(180deg, #8a8ca8, #5f6280);
  }

  .task-card.status-in-progress::before {
    background: linear-gradient(180deg, #4b7bec, #3867d6);
  }

  .task-card.status-done::before {
    background: linear-gradient(180deg, #20bf6b, #0fb982);
  }

  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ✨ Dropzone Pulse Effect */
  .column-dropzone.pulse {
    animation: pulseGlow 0.6s ease-out;
  }

  @keyframes pulseGlow {
    0% { box-shadow: 0 0 0 rgba(255,255,255,0); }
    50% { box-shadow: 0 0 25px rgba(255,255,255,0.25); }
    100% { box-shadow: 0 0 0 rgba(255,255,255,0); }
  }

  .task-card:active {
    transform: scale(1.03);
    cursor: grabbing;
  }

  /* 🎨 Fixed Custom Dropdown Style */
  .custom-select-status {
    background: rgba(255, 255, 255, 0.08);
    color: #f5f5f5;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    padding: 6px 12px;
    width: 130px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: blur(6px);
    appearance: none;
    cursor: pointer;

    /* Custom dropdown arrow */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23cccccc' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 0.9rem;
  }

  /* 🔲 Hover / Focus behavior */
  .custom-select-status:hover,
  .custom-select-status:focus {
    border-color: #bba9ff;
    box-shadow: 0 0 8px rgba(155, 140, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
    outline: none;
  }

  /* 🧱 Dropdown Options (consistent across browsers) */
  .custom-select-status option {
    background-color: #1e1e2e;
    color: #f5f5f5;
    padding: 8px;
    font-size: 0.9rem;
    border: none;
  }

  .custom-select-status option:hover,
  .custom-select-status option:focus,
  .custom-select-status option:checked {
    background-color: #44475a;
    color: #fff;
  }

  /* Optional pastel colors per status */
  .custom-select-status option[value="todo"] {
    background-color: #3b3b5a;
  }

  .custom-select-status option[value="in-progress"] {
    background-color: #344e8a;
  }

  .custom-select-status option[value="done"] {
    background-color: #2c5f4a;
  }

  /* 🌈 Smooth dropdown animation */
  select.custom-select-status:focus option {
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Firefox Fix */
  .custom-select-status::-moz-focus-inner {
    border: 0;
  }
`}
</style>
    </>
  );
}

export default ProjectBoard;
