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

postSchema.index({
  title: "text",
  description: "text",
});

export default mongoose.model("Post", postSchema);