const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addComment, getCommentsByTask, deleteComment } = require("../controllers/commentController");

router.use(authMiddleware);

router.post("/", addComment);
router.get("/task/:taskId", getCommentsByTask);
router.delete("/:id", deleteComment);

module.exports = router;
