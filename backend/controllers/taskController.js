const Task = require("../models/Task");
const Project = require("../models/Project");

// Create task
const createTask = async (req, res) => {
  try {
    const { title, description, status, project, assignedTo, dueDate } = req.body;

    // Check project exists
    const existingProject = await Project.findById(project);
    if (!existingProject) return res.status(404).json({ message: "Project not found" });

    const task = await Task.create({
      title,
      description,
      status,
      project,
      assignedTo,
      createdBy: req.user.id,
      dueDate
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tasks for a project
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo, dueDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only creator or assigned user can edit
    if (task.createdBy.toString() !== req.user.id && task.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task and related comments deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createTask, getTasksByProject, updateTask, deleteTask };
