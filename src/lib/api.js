import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL ?? "http://144.24.81.60:5000";

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// 서버가 "/uploads/..." 형태의 상대 경로를 내려주므로 절대 URL로 변환
export const imageUrl = (path) => `${API_BASE}${path}`;
