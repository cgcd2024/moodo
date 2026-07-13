import fs from "fs";
import path from "path";

import Post from "../models/Post.js";
import { uploadDir } from "../middleware/upload.js";
import { saveAsWebp } from "../utils/image.js";
import { randomNickname } from "../utils/nickname.js";

// 게시글 생성 (이미지 업로드 포함)
export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "제목과 설명을 모두 입력해주세요.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "이미지 파일이 필요합니다.",
      });
    }

    // 업로드된 이미지를 WebP로 변환해 저장
    const filename = await saveAsWebp(req.file, uploadDir);

    const post = await Post.create({
      title: title.trim(),
      description,
      imageUrl: `/uploads/${filename}`,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 생성 실패",
    });
  }
};

// 게시글 삭제
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    // 디스크의 이미지 파일도 정리 (실패해도 무시)
    if (post.imageUrl?.startsWith("/uploads/")) {
      const filePath = path.join(uploadDir, path.basename(post.imageUrl));
      fs.unlink(filePath, () => {});
    }

    res.status(200).json({ message: "삭제 완료", _id: post._id });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 삭제 실패",
    });
  }
};

// 모든 게시글 조회
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 조회 실패",
    });
  }
};

// 게시글 추천 / 비추천
export const votePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    if (type === "up") {
      post.upvotes += 1;
    } else if (type === "down") {
      post.downvotes += 1;
    } else {
      return res.status(400).json({
        message: "잘못된 투표 타입입니다.",
      });
    }

    await post.save();

    res.status(200).json(post);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "투표 실패",
    });
  }
};

// 댓글 작성
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, content } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    // 작성자 미지정 시 "상황 + 닉네임" 랜덤 조합으로 생성
    const trimmed = author?.trim();

    post.comments.push({
      author: trimmed && trimmed !== "익명" ? trimmed : randomNickname(),
      content,
    });

    await post.save();

    res.status(201).json(post);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "댓글 작성 실패",
    });
  }
};

// 댓글 좋아요
export const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "댓글을 찾을 수 없습니다.",
      });
    }

    comment.likeCount += 1;

    await post.save();

    res.status(200).json(post);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "댓글 좋아요 실패",
    });
  }
};