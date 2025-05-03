## TODO 리스트

1. **Firebase 설정**

   - [ ] Firebase 프로젝트 생성
   - [ ] Firestore DB 설정
   - [ ] Realtime Database 설정
   - [ ] Firebase Storage 설정
   - [ ] Firebase 웹 앱 등록 및 구성 정보 가져오기
   - [ ] Firebase 초기화 파일 생성 (src/shared/config/firebase.ts)
   - [ ] 환경 변수 설정 (.env.local)

2. **공통 타입 정의**

   - [ ] GameQuestion 타입 정의 (src/shared/config/types.ts)
   - [ ] GameSession 타입 정의
   - [ ] Player 타입 정의

3. **관리자 페이지 구현**

   - [ ] 관리자 페이지 라우트 생성 (/admin)
   - [ ] 문제 목록 렌더링 컴포넌트 구현
   - [ ] 문제 추가/수정 폼 컴포넌트 구현
   - [ ] 이미지 업로드 기능 구현
   - [ ] 게임 유형별 폼 필드 다르게 표시

4. **게임 서비스 로직 구현**

   - [ ] getQuestions 함수 구현
   - [ ] getCurrentGameSession 함수 구현
   - [ ] getCurrentQuestion 함수 구현
   - [ ] startGameSession 함수 구현
   - [ ] stopGameSession 함수 구현
   - [ ] moveToNextQuestion 함수 구현
   - [ ] generateRandomName 함수 구현 (랜덤 이름 생성)
   - [ ] joinGameWithRandomName 함수 구현
   - [ ] submitAnswer 함수 구현
   - [ ] markPlayerWrong 함수 구현 (오답 처리)

5. **게임 진행자 화면 구현**

   - [ ] 게임 진행자 라우트 생성 (/host)
   - [ ] 게임 상태 표시 UI 구현
   - [ ] 현재 문제 및 정답 표시 구현
   - [ ] 참가자 목록 및 가장 빠른 응답자 표시
   - [ ] 문제 선택 UI 구현
   - [ ] 게임 시작/중지 버튼 구현
   - [ ] 다음 문제로 이동 기능 구현
   - [ ] "땡" 버튼 구현 (오답 처리)

6. **참여자 화면 구현**

   - [ ] 메인 페이지 라우트 설정 (/)
   - [ ] 자동 참가 로직 구현
   - [ ] 랜덤 이름 표시 UI 구현
   - [ ] 현재 문제 표시 구현
   - [ ] 정답 제출 버튼 구현
   - [ ] 쿨다운 타이머 및 프로그레스 바 구현 (3초)
   - [ ] 참가자 목록 표시 구현
   - [ ] 다양한 상태에 따른 UI 처리 (비활성화, 오답, 등)

7. **보안 및 규칙 설정**

   - [ ] Firestore 보안 규칙 설정
   - [ ] Realtime Database 보안 규칙 설정
   - [ ] Storage 보안 규칙 설정

8. **배포 및 테스트**
   - [ ] Firebase 호스팅 설정 (선택 사항)
   - [ ] 여러 디바이스에서 동시 접속 테스트
   - [ ] 게임 진행 흐름 테스트
   - [ ] 오류 및 예외 상황 처리 확인
