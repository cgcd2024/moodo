import Post from "../models/Post.js";

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

    post.comments.push({
      author: author || "익명",
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