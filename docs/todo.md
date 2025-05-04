# 똥차 퀴즈 개발 To-Do 리스트

이 문서는 똥차 퀴즈 웹 애플리케이션 개발을 위한 세부 작업을 정리합니다.

## 1. 기본 프로젝트 셋업
- [x] 깃허브 리포지토리 생성
- [x] Next.js 프로젝트 초기화
- [x] Shadcn/ui 설치 및 구성
- [x] Supabase 프로젝트 설정
- [x] TypeScript 설정
- [x] 기본 프로젝트 구조 셋업
- [ ] 환경 변수 설정 (.env, .env.example)

## 2. 퀴즈 타입 정의
- [x] Trivia Quiz 타입 정의
- [x] Movie Quiz 타입 정의
- [x] Photo-year Quiz 타입 정의
- [x] Guess-who Quiz 타입 정의

## 3. 데이터베이스 스키마 설정
- [x] 문제 테이블 스키마 정의
- [x] 관리자 테이블 스키마 정의
- [ ] 데이터베이스 인덱스 설정
- [ ] 초기 샘플 데이터 추가

## 4. Supabase 연동
- [ ] Supabase 클라이언트 설정
- [ ] 인증 관련 함수 구현
- [ ] 데이터 쿼리 함수 구현
- [ ] 스토리지 함수 구현

## 5. 퀴즈 페이지 구현
- [ ] 메인 페이지 구현 (`src/pages/index.tsx`)
  - [ ] 퀴즈 유형 선택 UI
  - [ ] 기본 레이아웃 구현
  - [ ] 애니메이션 및 트랜지션 효과

- [ ] Trivia Quiz 페이지 구현 (`src/pages/trivia.tsx`)
  - [ ] 문제 표시 UI
  - [ ] 정답 확인 기능
  - [ ] 점수 계산 및 표시
  
- [ ] Movie Quiz 페이지 구현 (`src/pages/movie.tsx`)
  - [ ] 영화 대사 표시 UI
  - [ ] 정답 확인 기능
  - [ ] 점수 계산 및 표시
  
- [ ] Photo-year Quiz 페이지 구현 (`src/pages/photo-year.tsx`)
  - [ ] 사진 표시 UI
  - [ ] 년도 입력 기능
  - [ ] 정답 확인 및 점수 계산
  
- [ ] Guess-who Quiz 페이지 구현 (`src/pages/guess-who.tsx`)
  - [ ] 3단계로 나눠서 이미지 표시 UI
  - [ ] 힌트 시스템 구현
  - [ ] 정답 확인 및 점수 계산

## 6. API 엔드포인트 구현
- [ ] 공통 API 유틸리티 함수 구현
- [ ] Trivia Quiz API 엔드포인트 (`src/pages/api/trivia-quiz.ts`)
- [ ] Movie Quiz API 엔드포인트 (`src/pages/api/movie-quiz.ts`)
- [ ] Photo-year Quiz API 엔드포인트 (`src/pages/api/photo-year-quiz.ts`)
- [ ] Guess-who Quiz API 엔드포인트 (`src/pages/api/guess-who-quiz.ts`)

## 7. 관리자 페이지 구현
### 7.1. 로그인 시스템
- [ ] 로그인 페이지 구현 (`src/pages/admin/login.tsx`)
- [ ] 로그인 처리 및 인증 관련 로직 구현
- [ ] 세션 관리 구현
- [ ] 접근 제어 기능 구현

### 7.2. 문제 관리 페이지
- [ ] 관리자 메인 페이지 - 문제 목록 (`src/pages/admin/index.tsx`)
  - [ ] 문제 유형별 필터링 기능
  - [ ] 문제 목록 표시
  - [ ] 추가/수정/삭제 버튼 표시

- [ ] 문제 생성 페이지 (`src/pages/admin/create.tsx`)
  - [ ] 문제 유형 선택형 폼
  - [ ] 이미지 업로드 기능 (Photo-year, Guess-who 유형)
  - [ ] 유효성 검사 및 제출 기능

- [ ] 문제 수정 페이지 (`src/pages/admin/[uuid].tsx`)
  - [ ] 기존 문제 조회
  - [ ] 수정 기능
  - [ ] 삭제 기능

### 7.3. API 엔드포인트 구현
- [ ] 문제 목록 조회 API
- [ ] 문제 상세 조회 API
- [ ] 문제 생성 API
- [ ] 문제 수정 API
- [ ] 문제 삭제 API

## 8. UI 컴포넌트 구현
- [ ] 공통 레이아웃 컴포넌트 구현
  - [ ] 헤더 컴포넌트
  - [ ] 푸터 컴포넌트
  - [ ] 내비게이션 바 컴포넌트
  
- [ ] 퀴즈 공통 컴포넌트 구현
  - [ ] 문제 카드 컴포넌트
  - [ ] 정답 입력 폼 컴포넌트
  - [ ] 결과 표시 컴포넌트
  
- [ ] 관리자 페이지 컴포넌트 구현
  - [ ] 사이드바 컴포넌트
  - [ ] 문제 폼 컴포넌트
  - [ ] 이미지 업로드 컴포넌트

## 9. 배포 및 테스트
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] Vercel 배포 설정
- [ ] CI/CD 파이프라인 구성
- [ ] 성능 최적화
- [ ] 접근성 테스트

## 10. 추가 기능 (옵션)
- [ ] 사용자 점수 기록 기능
- [ ] 리더보드 구현
- [ ] 소셜 미디어 공유 기능
- [ ] 다국어 지원
- [ ] 다크 모드 지원
