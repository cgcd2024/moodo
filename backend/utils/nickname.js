// "상황 + 닉네임" 랜덤 조합으로 익명 댓글 작성자 이름 생성

const SITUATIONS = [
  "파산한",
  "지각한",
  "무야호 외치는",
  "짜장면 시키는",
  "벌칙 수행 중인",
  "복불복에 진",
  "추격전에서 잡힌",
  "가요제 준비하는",
  "김상덕씨 찾는",
  "정신 못 차린",
  "쩜오행 탄",
  "몸개그 하는",
  "궁밀리터리한",
  "돈가방 들고 튄",
  "얼음물에 빠진",
];

const NICKNAMES = [
  "유느님",
  "박거성",
  "명수옹",
  "식신",
  "뚱스",
  "돌아이",
  "꼬마",
  "어르신",
  "하이브리드 샘이솟아 리오레이비",
  "무도빠",
  "일밤 스파이",
  "제7의 멤버",
  "방청객",
  "김태호 PD",
];

export function randomNickname() {
  const situation = SITUATIONS[Math.floor(Math.random() * SITUATIONS.length)];
  const nickname = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
  return `${situation} ${nickname}`;
}
