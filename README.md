# Folks-Backend

## [ERD](https://dbdiagram.io/d/folksfashioncommunity-680a46a51ca52373f537a8de)
![erd](./assets/erd.png)

## 사용 기술

| 기술       | 선택 이유                                                                 |
|------------|--------------------------------------------------------------------------|
| **DB**     | PostgreSQL (ORM/Prisma와 호환성 높음)                              |
| **ORM**    | Prisma (타입 안전성, DX, Nest와 잘 어울림)                             |
| **NestJS** | 모듈 기반, 테스트하기 쉽고 규모 커져도 유지 쉬움                        |
| **Swagger**| REST 문서화 자동화 (`@nestjs/swagger`)                                   |
| **Validation** | `class-validator` + `class-transformer`로 DTO 검증                    |
| **Auth**   | `Passport.js` + JWT (검증된 안정성 및 다량의 샘플 존재)                        |


## 진행 상황

| 항목     | 상태                                                                 |
|------------|--------------------------------------------------------------------------|
| 회원가입 (/user/signup) | O                                                               |
| 로그인 및 JWT 발급 (/auth/login) | O                                                      |
| 로그인 실패 에러 핸들링 고도화 (일관된 에러 메시지 구조 만들기)  | O   => httpException 간편 활용  |
| 비밀번호 암호화 (bcryptjs) 적용	[평문 비밀번호 저장 금지 (보안 필수)] | O                           |
| JWT 인증 Guard 적용(인증 필요한 API 보호, (e.g., 내 정보 조회 등))          | O |
| 로그인한 유저 정보 가져오기 (req.user) (JwtStrategy로 유저 데이터 inject)   | O              |
| 인증 통과한 유저만 접근 가능한 API 예제	/me API (내 정보 보기) 만들어보기     | O               |
| 전역 에러 핸들링 (Global Exception Filter)	                        | X               |