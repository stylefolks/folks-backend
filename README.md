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

## 🎨 기본 UI/UX

- folks/front-end에서 진행 예정
  - PageTransition 시스템 연동 (프론트단)
  - 반응형 대응 및 Tailwind 기반 디자인 시스템
## 🚧 남은 작업 (v2 Plan)

- [x] CREW 생성/수정/삭제 API 확장
- [x] CREW 전용 게시글/리뷰 등록 기능
- [ ] CREW NOTICE 노출 및 외부 링크 지원
- [x] 오프라인 이벤트 스키마(Event) 추가
- [x] 이벤트 등록/조회 API 구현
- [x] 프로필에 CREW 활동 이력 노출
- [ ] BRAND 게시물 상단 고정(BM 기능)
- [ ] CREW 페이지 스폰서 영역 관리
- [ ] Premium COLUMN 표시 구조 반영
- [ ] Vitest 기반 단위 테스트 작성
- [ ] Playwright E2E 테스트 작성
- [ ] UX 개선 및 디자인 피드백 반영

## 🔄 최근 업데이트

- Event 모델과 후원 필드 등 v2 기능을 반영하여 Prisma 스키마를 수정했습니다.
- CREW 멤버십 API와 전용 게시글, 이벤트 관리 기능을 추가했습니다.


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
- [ ] `GET /crews/:crewId/members`
- [ ] `PATCH /crews/:crewId/members/:userId/role`
- [ ] `DELETE /crews/:crewId/members/:userId`

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
- [ ] `GET /config/post-types`
- [ ] `GET /config/user-roles`
- [ ] `GET /config/crew-status`
- [ ] `GET /config/post-visibility`
