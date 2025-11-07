const mongoose = require("mongoose");
const Task = require("./Task");
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: "add description"
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},
{ timestamps: true });

//cascade delete tasks when a project is deleted
ProjectSchema.pre("findOneAndDelete", async function (next) {
  const projectId = this.getQuery()._id;
  const tasks = await Task.find({project: projectId})
  for (const task of tasks){
    await Task.findOneAndDelete({_id: task._id});
  }
  next();
});

module.exports = mongoose.model("Project", ProjectSchema);
