import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

// 업로드된 이미지를 WebP로 변환해 저장하고 파일명을 반환
// - PNG: 무손실 WebP (화질 저하 0, 용량 20~30% 감소)
// - JPEG: 고품질 손실 WebP (q85, 시각적 무손실 수준, 용량 30~50% 감소)
// - GIF: 애니메이션 유지한 채 WebP로 변환
// - WebP: 재인코딩하면 화질만 나빠지므로 원본 그대로 저장
export async function saveAsWebp(file, uploadDir) {
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  const outPath = path.join(uploadDir, filename);

  if (file.mimetype === "image/webp") {
    await fs.writeFile(outPath, file.buffer);
    return filename;
  }

  const animated = file.mimetype === "image/gif";
  const image = sharp(file.buffer, { animated });

  const webpOptions =
    file.mimetype === "image/png"
      ? { lossless: true, effort: 5 }
      : { quality: 85, effort: 5 };

  await image.webp(webpOptions).toFile(outPath);

  return filename;
}
