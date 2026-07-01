import express from "express";
import {
  getPosts,
  votePost,
  addComment,
  likeComment,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/:id/vote", votePost);
router.post("/:id/comments", addComment);
router.post("/:postId/comments/:commentId/like", likeComment);

export default router;