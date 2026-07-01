import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

// MongoDB 연결
connectDB();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// JSON 요청 처리
app.use(express.json());
app.use("/api/posts", postRoutes);

// uploads 폴더를 정적 파일로 공개
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Moodo API");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});