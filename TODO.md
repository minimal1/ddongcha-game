# 레크리에이션 게임 웹앱 TODO 리스트

## 소개

이 문서는 레크리에이션 게임 웹 앱 개발계획과 진행상황을 담고 있습니다. 게임은 호스트와 플레이어들이 웹브라우저에서 실시간으로 상호작용하며 진행하는 형태로, 필요를 충족하는 기능을 심플한 게임 진행으로 지원합니다.

지금은 Supabase를 백엔드로 사용하여 다음과 같은 주요 기능을 구현합니다:
1. 실시간 웹소켓 업데이트: 가입 플레이어 정보를 실시간으로 주고받습니다
2. 랜덤 닉네임 생성: 플레이어들은 별도로 "플레이어 + 번호" 형식의 자동 이름을 부여받습니다
3. 문항 진행: 문항 진행 시 3초 카운트다운으로 긴장감을 부여합니다
4. 관리자 CRUD 페이지: 다양한 게임 진행과 수정을 관리할 수 있습니다

이 프로젝트는 Next.js와 TypeScript를 기반으로 구현되며, 심플하면서도 원활한 게임 진행을 목표로 합니다.

## TODO 리스트

1. **Supabase 설정**
   - [x] Supabase 프로젝트 설정
   - [x] 클라이언트사이드 통합 설정 및 초기화
   - [x] 스토리지 설정 설정
   - [x] Realtime 기능 설정화
   - [x] Supabase 컨텍스트프로바이더 설정 및 초기화 (src/shared/config/supabase.ts)
   - [x] 환경 변수 설정 (.env.local)

2. **데이터 타입 정의**
   - [x] GameQuestion 데이터 타입 정의 (src/shared/config/types.ts)
   - [x] GameSession 데이터 타입 정의
   - [x] Player 데이터 타입 정의

3. **게임 서비스 로직 구현**
   - [x] getQuestions 함수 구현 (useGameSession 훅)
   - [x] getCurrentGameSession 함수 구현 (useGameState 훅)
   - [x] getCurrentQuestion 함수 구현 (useGameState 훅)
   - [x] startGameSession 함수 구현 (useGameState 훅)
   - [x] stopGameSession 함수 구현 (useGameState 훅)
   - [x] moveToNextQuestion 함수 구현 (useGameState 훅)
   - [x] generateRandomName 함수 구현 (useGameJoin 훅)
   - [x] joinGameWithRandomName 함수 구현 (useGameJoin 훅)
   - [x] submitAnswer 함수 구현 (useGameJoin 훅)
   - [x] markPlayerWrong 함수 구현 (useGameState 훅)
   - [x] 타이머 기능 구현 (useGameTimer 훅)

4. **관리자 페이지 구현**
   - [x] 관리자 페이지 레이아웃 설정 (/admin)
   - [x] 문항 관리 컴포넌트 개발
   - [x] 문항 추가/수정 및 프리뷰 컴포넌트 구현
   - [x] 게임 세션 관리 컴포넌트 개발
   - [x] 게임 세션 생성 컴포넌트 개발
   - [ ] 이미지와 첨부파일 기능 구현 (Supabase Storage 활용)

5. **게임 진행자 화면 구현**
   - [ ] 게임 진행자 레이아웃 설정 (/host)
   - [ ] 게임 시작 화면 UI 구현
   - [ ] 참가 문항 및 상태 화면 구현
   - [ ] 플레이어 현황 및 가입 대기홀 참여자 화면
   - [ ] 문항 승패 UI 구현
   - [ ] 게임 시작/중지 및 타이머 구현
   - [ ] 다음 문항으로 이동 기능 구현
   - [ ] "땡" 기능 구현 (문항 패배)

6. **플레이어 화면 구현**
   - [ ] 메인 페이지 레이아웃 설정 (/)
   - [ ] 새로운 플레이 로직 구현
   - [ ] 랜덤 이름 화면 UI 구현
   - [ ] 참가 문항 화면 구현
   - [ ] 상태 표시 기능 구현
   - [ ] 카운트다운 대기시간 및 프로그레스바 구현 (3초)
   - [ ] 플레이어 참여 화면 구현
   - [ ] 다양한 상황별 현황 UI 표시 (프리즈타임, 문항, 등)

7. **보안 및 최적화 설정**
   - [ ] Row Level Security (RLS) 설정
   - [ ] 스토리지 보안 정책 설정
   - [ ] API 호출 제한 설정

8. **배포 및 테스트**
   - [ ] Vercel 또는 Netlify 배포 설정
   - [ ] 여러 디바이스에서 성능 최적화 테스트
   - [ ] 게임 진행 데모 테스트
   - [ ] 예외 및 오류 상황 대응 설정
