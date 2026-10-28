// 관리자 비밀번호 해시 생성: npm run hash-password -- '새비밀번호'
// 출력값을 ADMIN_PASSWORD_HASH 환경변수에 넣으세요. (bcrypt 해시를 base64로 인코딩 → .env 의 $ 문제 회피)
import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error("사용법: npm run hash-password -- '10자 이상 비밀번호'");
  process.exit(1);
}
const hash = await bcrypt.hash(pw, 12);
console.log(Buffer.from(hash).toString("base64"));
