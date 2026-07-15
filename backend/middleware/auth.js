// 관리자 인증: 환경변수 ADMIN_KEY 우선, 없으면 기본값 (배포 후 backend/.env에서 변경 권장)
const ADMIN_KEY = process.env.ADMIN_KEY || "mudo2026!";

// 로그인: 비밀번호 검증
export const adminLogin = (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_KEY) {
    return res.status(200).json({ ok: true });
  }

  res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
};

// 게시글 등록/수정/삭제 보호 미들웨어
export const requireAdmin = (req, res, next) => {
  if (req.headers["x-admin-key"] === ADMIN_KEY) {
    return next();
  }

  res.status(401).json({ message: "관리자 인증이 필요합니다." });
};
