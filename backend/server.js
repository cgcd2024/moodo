import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";
import { adminLogin } from "./middleware/auth.js";

dotenv.config();

// MongoDB 연결
connectDB();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// JSON 요청 처리
app.use(express.json());
app.post("/api/admin/login", adminLogin);
app.use("/api/posts", postRoutes);

// uploads 폴더를 정적 파일로 공개 (실행 위치와 무관하게 절대 경로 사용)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Moodo API");
});

// multer 등 미들웨어 에러 처리
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ message: err.message || "요청 처리에 실패했습니다." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
