import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      default: "익명",
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    // 검색 인덱스용 태그 (쉼표 구분 문자열, 게시글에는 표시하지 않음)
    tags: {
      type: String,
      default: "",
      trim: true,
    },

    upvotes: {
      type: Number,
      default: 0,
    },

    downvotes: {
      type: Number,
      default: 0,
    },

    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

// 주의: text 인덱스는 컬렉션당 1개만 허용되므로, 배포 시 기존 인덱스를 먼저 삭제해야 한다
// mongosh> db.posts.dropIndex("title_text_description_text")
postSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

export default mongoose.model("Post", postSchema);