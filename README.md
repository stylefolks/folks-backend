# Folks-Backend

## [ERD](https://dbdiagram.io/d/folksfashioncommunity-680a46a51ca52373f537a8de)

![erd](./assets/erd.png)

## 사용 기술

| 기술           | 선택 이유                                               |
| -------------- | ------------------------------------------------------- |
| **DB**         | PostgreSQL (ORM/Prisma와 호환성 높음)                   |
| **ORM**        | Prisma (타입 안전성, DX, Nest와 잘 어울림)              |
| **NestJS**     | 모듈 기반, 테스트하기 쉽고 규모 커져도 유지 쉬움        |
| **Swagger**    | REST 문서화 자동화 (`@nestjs/swagger`)                  |
| **Validation** | `class-validator` + `class-transformer`로 DTO 검증      |
| **Auth**       | `Passport.js` + JWT (검증된 안정성 및 다량의 샘플 존재) |

# 필요 버전

- Node.js 22.x
- pnpm 10.13.1

# 진행 상황

## ⚙️ 기본 인프라/보일러플레이트

- [x] Prisma + NestJS 연동
- [x] 환경 구성 (Docker, PostgreSQL, Prisma)
- [x] E2E 테스트 기초 구성
- [x] 환경 변수 및 설정 분리 (@nestjs/config)
- [x] GlobalExceptionFilter 적용

## 회원가입/로그인

- [x] 이메일 + 비밀번호 기반 회원가입 및 로그인 구현
- [x] 비밀번호 암호화 (bcrypt)
- [x] JWT 발급 및 인증 로직 구현
- [x] JwtGuard 적용
- [x] 본인계정 CRUD(/me)
- [x] 인증된 유저만 접근 가능한 API 예제 작성

## 📝 게시글 작성/조회

- [x] Post 모델 정의
- [x] 게시글 타입 필드 (TALK, COLUMN, CREW 등)
- [x] ProseMirror 기반 에디터 연동 (저장 구조 고민 필요) -> 임시 JSON 선택
- [x] 임시저장 기능 (isDraft)
- [x] 게시글 CRUD API 🏃
- [x] 게시글 목록/상세 API

## 🎪 CREW 페이지 생성/조회

- [x] Influencer 등급 로직 설계 (우선은 수동 지정으로 시작 가능)
- [x] Crew 모델 정의 및 연동
- [x] 크루 페이지 생성/조회 API

## 🧑‍💼 유저 프로필 페이지

- [x] 내가 쓴 글, 좋아요, 팔로우 등 모델 정리
- [x] 유저 정보 수정 API 확장 (소개글, 이미지 등)

## 💬 댓글 기능

- [x] 댓글/대댓글 모델 설계
- [x] 댓글 CRUD API

## REST API Checklist

### 🔐 인증 & 회원가입

- [x] `POST /auth/signup`
- [x] `POST /auth/verify-email`
- [x] `POST /auth/request-email-verification`

### 👤 유저

- [x] `GET /users/:id`
- [x] `GET /users/:id/followers`
- [x] `GET /users/:id/following`
- [x] `POST /users/:id/follow`
- [x] `DELETE /users/:id/unfollow`
- [x] `PATCH /users/me/status`
- [x] `POST /users/request-brand-role`
- [x] `POST /users/approve-brand-role`

### 🧑‍🤝‍🧑 크루

- [x] `POST /crews`
- [x] `GET /crews/:id`
- [x] `POST /crews/:id/join`
- [x] `POST /crews/:id/leave`
- [x] `PATCH /crews/:id/status`
- [x] `PATCH /crews/:id/transfer-ownership`

### 👥 크루 멤버

- [x] `GET /crews/:crewId/members`
- [x] `PATCH /crews/:crewId/members/:userId/role`
- [x] `DELETE /crews/:crewId/members/:userId`

### 🧷 크루탭/토픽

- [x] `POST /crews/:crewId/tabs`
- [x] `PATCH /crews/:crewId/tabs/:tabId`
- [x] `DELETE /crews/:crewId/tabs/:tabId`
- [x] `POST /topics`

### 📝 게시글

- [x] `POST /posts`
- [x] `PATCH /posts/:id`
- [x] `DELETE /posts/:id`
- [x] `PATCH /posts/:id/visibility`
- [x] `GET /posts?mention=crewId`
- [x] `GET /posts?type=`
- [x] `POST /posts/:id/parse-mentions`

### 💰 후원

- [x] `POST /sponsorships`
- [x] `POST /sponsorships/webhook`
- [x] `POST /sponsorships/validate`

### 📢 광고

- [x] `POST /ad-campaigns`
- [x] `PATCH /ad-campaigns/:id/status`

### ⚠️ 신고

- [x] `POST /reports`
- [x] `GET /reports?status=pending`
- [x] `PATCH /reports/:id/resolve`

### 🔔 알림 템플릿

- [x] `GET /notification-templates`
- [x] `POST /notification-templates`

### ⚙️ 설정 정보

- [x] `GET /config/post-types`
- [x] `GET /config/user-roles`
- [x] `GET /config/crew-status`
- [x] `GET /config/post-visibility`

### 🫡 추가작업

- [x] COLUMN 작성 권한 제한 (일반 유저 작성 시 에러 처리)
- [x] OWNER 승계 실패 시 CREW 상태 비공개 전환
