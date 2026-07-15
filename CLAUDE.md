# CLAUDE.md

무한도전 짤 아카이브 "무도짤 저장소". 프론트(루트)와 백엔드(`backend/`)가 한 저장소에 있다.

## 명령어

```bash
npm run dev          # 프론트 개발 서버 (localhost:5173)
npm run lint         # ESLint — 작업 후 반드시 클린 상태 유지
npm run build        # 프론트 빌드

cd backend && npm run dev   # 백엔드 (nodemon, backend/.env에 MONGO_URI 필요)
```

- 백엔드는 로컬에 `.env`가 없어 보통 실행 불가. 원격 서버(`http://144.24.81.60:5000`)가 떠 있으니 프론트 개발은 그것을 그대로 사용한다.
- 백엔드 로직 검증은 서버 실행 대신 단독 node 스크립트로 한다 (예: sharp 변환, 닉네임 생성). 테스트 스크립트는 실행 후 삭제.

## 아키텍처

- **라우팅**: react-router 없음. `src/Root.jsx`가 해시로 분기 — `#/admin` → `AdminApp`, 그 외 → `App`(메인).
- **API 주소**: 반드시 `src/lib/api.js`의 `api`(axios 인스턴스)와 `imageUrl()`을 사용. 컴포넌트에 URL 하드코딩 금지. dev는 원격 백엔드(`144.24.81.60:5000`) 직접 호출, 프로덕션 빌드는 same-origin(`/api`) — nginx가 프록시 (`docs/deploy/nginx-muhaha.kr.conf`). `VITE_API_URL`로 강제 지정 가능.
- **데이터 모델**: Post 단일 컬렉션, comments는 내장 문서. `tags`는 쉼표 구분 문자열(검색용, 게시글에 미표시). text 인덱스는 컬렉션당 1개 — 인덱스 필드 변경 시 서버에서 기존 인덱스 삭제 필요.
- **이미지 업로드**: multer 메모리 버퍼 → `backend/utils/image.js`에서 WebP 변환 저장 (PNG 무손실 / JPEG q85 / GIF 애니메이션 유지 / WebP 원본 유지). 파일은 `backend/uploads/` 디스크에, DB에는 `/uploads/...` 경로만.
- **검색**: 현재 클라이언트 필터링 (제목·설명·태그). 서버 text 인덱스는 아직 미사용.
- **중복 방지**: 투표·댓글 좋아요는 localStorage 기록으로 1회 제한 (클라이언트 제한임을 인지할 것).
- **랜덤 닉네임**: 댓글 author 미전송 시 백엔드가 "상황 + 닉네임" 조합 생성 (`backend/utils/nickname.js`).

## 컨벤션

- 주석·커밋 메시지·UI 문구 모두 한국어.
- **UI에 이모지 사용 금지** (사용자 명시 요청). 아이콘 라벨은 텍스트로.
- 브랜드 컬러는 노랑(`#facc15`, yellow-400) 단일 포인트. 모달·버튼·포커스 링 전부 노랑 계열로 통일.
- 다크 테마 고정 (`#0f0f13` 배경). 폰트는 Pretendard (index.html CDN + index.css `@theme`).
- 로고 아이콘은 사용하지 않기로 결정 (여러 시안 반려 끝에 제거) — 헤더는 텍스트 워드마크만, 파비콘(`public/favicon.svg`)은 노란 라운드 사각형. 캐릭터 아이콘을 다시 시도할 경우 MBC 원본(로고, 무도리)을 그대로 복제하지 말 것.
- 모바일: input은 16px 이상(iOS 포커스 줌 방지), 모달은 모바일 전체 화면 + dvh 단위.

## Git / 배포

- 작업 브랜치는 `develop`. 커밋·푸시는 사용자가 요청할 때만.
- PowerShell에서 커밋 메시지에 큰따옴표(`"`)를 넣으면 인자가 깨진다 — 메시지에 따옴표 사용 금지.
- 배포는 사용자가 원격 서버에서 직접: `git pull` → `backend && npm install` → 재시작. 백엔드 API를 추가해도 배포 전에는 원격에서 404가 나므로, 프론트 에러 메시지에 "서버 배포 확인" 안내를 포함하는 패턴을 유지.
- 작업을 마치면 `docs/worklog/YYYY-MM-DD.md`에 일자별로 기록한다.

## 알려진 이슈 / TODO

- `#/admin`은 인증 없음 — 주소만 알면 접근 가능. 인증 추가 예정.
- 짤 크롤링 수집 예정.
- 게시물 이미지 복사/공유 기능 예정 — Web Share API는 HTTPS 필수, 카카오 SDK는 사용자 발급 JS 키 필요, 인스타 DM은 공식 API 없음.
- 운영 도메인: `muhaha.kr` (nginx 80 프록시, SSL은 certbot 적용 예정). same-origin 빌드라 HTTPS 전환 시 재빌드 불필요.
