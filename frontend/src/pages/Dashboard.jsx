import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ToastNotification from "../components/ToastNotification";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ title: "", description: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/projects");
      setProjects(res.data);
    } catch (error) {
      setToast({ show: true, message: "Failed to fetch projects!", type: "error" });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Create project
  const createProject = async (e) => {
    e.preventDefault();
    if (!newProject.title) return;
    try {
      const res = await axios.post("/api/projects", newProject);
      setProjects([...projects, res.data]);
      setNewProject({ title: "", description: "" });
      setToast({ show: true, message: "Project added successfully!", type: "success" });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || "Failed to create project!", type: "error" });
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      setProjects(projects.filter((p) => p._id !== projectId));
      setToast({ show: true, message: "Project deleted!", type: "warning" });
    } catch (error) {
      setToast({ show: true, message: "Failed to delete project!", type: "error" });
    }
  };

  // Edit project
  const startEdit = (project) => {
    setEditingId(project._id);
    setEditingData({ title: project.title, description: project.description });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/projects/${id}`, editingData);
      setProjects(
        projects.map((p) => (p._id === id ? { ...p, ...editingData } : p))
      );
      setEditingId(null);
      setEditingData({ title: "", description: "" });
      setToast({ show: true, message: "Project updated!", type: "success" });
    } catch (error) {
      setToast({ show: true, message: "Failed to update project!", type: "error" });
    }
  };

  const handleEditChange = (e) => {
    setEditingData({ ...editingData, [e.target.name]: e.target.value });
  };

  // Styles
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    fontFamily: "'Roboto Mono', monospace",
    paddingBottom: "4rem",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    color: "white",
    borderRadius: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const inputStyle = {
    borderRadius: "8px",
    padding: "8px",
    border: "1px solid rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "white",
    outline: "none",
  };

  return (
    <div style={pageStyle}>
      <Navbar />

      <div className="container py-5 text-light">
        <h2 className="fw-bold text-center mb-5">Your Projects Dashboard</h2>

        {/* Add Project Section */}
        <div className="text-center mb-5">
          <button
            className="btn btn-warning fw-semibold rounded-pill px-4 py-2 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#createProjectModal"
          >
            + New Project
          </button>
        </div>

        {/* Project List */}
        {projects.length === 0 ? (
          <p className="text-center text-light opacity-75">
            No projects yet. Click <strong>“+ New Project”</strong> to start!
          </p>
        ) : (
          <div className="row g-4 justify-content-center">
            {projects.map((project) => (
              <div key={project._id} className="col-md-4 col-sm-6">
                <div
                  className="card p-3 h-100"
                  style={cardStyle}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  {editingId === project._id ? (
                    <>
                      <input
                        name="title"
                        value={editingData.title}
                        onChange={handleEditChange}
                        style={inputStyle}
                        className="form-control mb-2"
                      />
                      <textarea
                        name="description"
                        value={editingData.description}
                        onChange={handleEditChange}
                        style={inputStyle}
                        className="form-control mb-3"
                      />
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          onClick={() => saveEdit(project._id)}
                          className="btn btn-success btn-sm px-3 fw-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-secondary btn-sm px-3 fw-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h5 className="fw-bold text-warning">{project.title}</h5>
                      <p className="text-light opacity-75">
                        {project.description || "No description"}
                      </p>
                      <div className="d-flex gap-2 mt-auto justify-content-end">
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => startEdit(project)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteProject(project._id)}
                        >
                          Delete
                        </button>
                        <Link to={`/projects/${project._id}`}>
                          <button className="btn btn-outline-light btn-sm">
                            Open
                          </button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <div
        className="modal fade"
        id="createProjectModal"
        tabIndex="-1"
        aria-labelledby="createProjectModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-light rounded-4 shadow-lg">
            <div className="modal-header border-0">
              <h5 className="modal-title" id="createProjectModalLabel">
                Create New Project
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={createProject}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Project Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter title"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Optional description"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
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
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        show={toast.show}
        setShow={(val) => setToast({ ...toast, show: val })}
      />
    </div>
  );
};

export default Dashboard;
