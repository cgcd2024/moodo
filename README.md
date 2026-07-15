# 무도짤 저장소 (Moodo)

무한도전 짤(밈) 아카이브. 짤을 검색하고, 추천/비추천 투표와 댓글을 남길 수 있다.

## 스택

- **프론트엔드**: React 19 + Vite 8 + Tailwind CSS 4 (Pretendard 폰트)
- **백엔드**: Express 5 + Mongoose 9 (MongoDB), multer + sharp (이미지 WebP 변환 업로드)

## 구조

```
├── src/            # 프론트엔드 (메인: #/, 관리자: #/admin 해시 라우팅)
│   ├── lib/api.js  # API 주소 일원화 (VITE_API_URL 환경변수 지원)
│   └── components/
├── backend/
│   ├── models/     # Post (comments 내장, tags 검색 인덱스)
│   ├── middleware/ # multer 업로드 (JPEG/PNG/WebP/GIF, 10MB)
│   ├── utils/      # WebP 변환, 랜덤 닉네임 생성
│   └── uploads/    # 업로드 이미지 저장 (git 미포함)
```

## 실행

```bash
# 프론트엔드
npm install
npm run dev          # http://localhost:5173

# 백엔드 (backend/.env에 MONGO_URI 필요)
cd backend
npm install
npm run dev          # http://localhost:5000
```

## 배포 체크리스트

```bash
cd /home/ubuntu/moodo && git pull origin develop
cd backend && npm install    # multer, sharp 설치
# 백엔드 재시작 (pm2 등)
```

- text 인덱스에 tags가 추가되어 **기존 인덱스를 먼저 삭제**해야 새 인덱스가 생성됨:
  `mongosh> db.posts.dropIndex("title_text_description_text")`
- HTTPS 적용 시 프론트 빌드에 `VITE_API_URL`을 https 도메인으로 지정할 것 (mixed content 방지)

## TODO

관리자페이지
- [x] 짤 아래에 tags 추가 (검색 인덱스용, 게시글에는 표기 X) — 모델/관리자 폼/검색 반영 완료
- [ ] 관리자 인증 (현재 #/admin은 주소만 알면 접근 가능)
- [ ] 짤 크롤링 수집

사용자페이지
- [x] 게시글 수려한 폰트 적용 — Pretendard로 확정
- [x] mobile 댓글 input focus 수정 — input 16px 고정 (iOS 포커스 줌 방지), 모달 모바일 전체화면(dvh)
- [ ] 게시물 상단 이미지 복사 or 공유 (카카오톡, 인스타DM, URL로 복사하기)

인프라
- [ ] 3000포트 http 기본포트(80)로 교체 / 도메인 구매 / SSL 인증서 적용
