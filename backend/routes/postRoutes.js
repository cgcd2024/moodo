import express from "express";
import { upload } from "../middleware/upload.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  votePost,
  addComment,
  likeComment,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", requireAdmin, upload.single("image"), createPost);
router.put("/:id", requireAdmin, updatePost);
router.delete("/:id", requireAdmin, deletePost);
router.post("/:id/vote", votePost);
router.post("/:id/comments", addComment);
router.post("/:postId/comments/:commentId/like", likeComment);

export default router;
