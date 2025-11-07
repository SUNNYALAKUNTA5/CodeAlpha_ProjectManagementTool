const { json } = require("express");
const Project = require("../models/Project");

// Create a project
const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    if(!title){
      return res.status(401).json({message: "title missing"});
    }
    
    const isAvailable = await Project.findOne({title});

    if (isAvailable){
      return res.status(401).json({message: "title unavailable"});
    }

    const project = await Project.create({
      title,
      description,
      members: members || [],
      createdBy: req.user.id
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all projects for logged-in user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user.id }, { members: req.user.id }]
    }).populate("members", "name email").populate("createdBy", "name email");

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single project by id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check access
    if (project.createdBy._id.toString() !== req.user.id &&
        !project.members.some(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only creator can update
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    if (members) project.members = members;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({_id: req.params.id});
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project and related tasks deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };
