const mongoose = require("mongoose");
const Comment = require("./Comment");
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: "add description"
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  dueDate: {
    type: Date
  }
}, { timestamps: true });

// Cascade delete comments when a task is deleted
TaskSchema.pre("findOneAndDelete", async function (next) {
  const taskId = this.getQuery()._id;
  await Comment.deleteMany({ task: taskId });
  next();
});

module.exports = mongoose.model("Task", TaskSchema);
