const Comment = require("../models/Comment");
const Task = require("../models/Task");

const addComment = async (req, res) => {
  try {
    const { text, taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comment = await Comment.create({
      text,
      task: taskId,
      user: req.user.id
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ task: taskId })
      .populate("user", "name email")
      .sort({ createdAt: 1 }); 

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    await Comment.findOneAndDelete({ _id: comment._id });
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { addComment, getCommentsByTask, deleteComment };
