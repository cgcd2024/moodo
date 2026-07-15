import axios from "axios";

// dev: 원격 백엔드 직접 호출 / build: same-origin (nginx가 /api, /uploads를 프록시)
// VITE_API_URL을 지정하면 둘 다 무시하고 해당 주소 사용
export const API_BASE =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://144.24.81.60:5000" : "");

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// 서버가 "/uploads/..." 형태의 상대 경로를 내려주므로 절대 URL로 변환
export const imageUrl = (path) => `${API_BASE}${path}`;
