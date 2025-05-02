# 동차아이즈의 레크리에이션 퀴즈 웹 어플리케이션

직장동료나 모임에서 레크리에이션 행사에서 사용할 수 있는 쉽고 재미있는 퀴즈형 레크리에이션 웹 어플리케이션입니다.

## 구현된 게임

1. **객관식 퀴즈 게임**: 다양한 종류의 객관식 문제를 푸는 퀴즈 게임입니다.
2. **영화관련, 대사 맞추기**: 유명 영화의 장면과 대사를 맞추는 게임입니다.
3. **얼굴 사진 퀴즈 - 확대 후 맞춤**: 확대된 얼굴 사진을 보고 누구인지 맞추는 게임입니다.
4. **얼굴 사진 퀴즈 - 촬영 연도**: 특정 사진의 촬영 연도를 맞추는 게임입니다.

## 기술 스택

- React
- TypeScript
- React Router

## 시작 방법

### 로컬 환경 시작

```bash
# 패키지 설치
npm install

# 로컬 서버 시작
npm start
```

### 배포

```bash
npm run build
```

## 이미지 저장 위치

각 게임에서 사용할 이미지는 다음 위치에 저장하면 됩니다:

- 얼굴 후 맞춤 게임: `/public/images/faces/` 디렉토리
- 특정 사진 연도 맞추기 게임: `/public/images/photos/` 디렉토리

이미지 저장 후 해당 게임의 config 파일에서 imagePath를 수정하세요.

## 게임 설정 위치

각 게임의 설정은 다음 파일에서 수정 가능합니다:

- 객관식 퀴즈: `src/features/trivia-quiz/config/triviaQuestions.ts`
- 영화 퀴즈: `src/features/movie-quiz/config/movieQuestions.ts`
- 얼굴 후 맞춤 퀴즈: `src/features/face-zoom-quiz/config/faceZoomQuestions.ts`
- 사진 연도 퀴즈: `src/features/photo-year-quiz/config/photoYearQuestions.ts`

## TODO 리스트

1. **객관식 스타일을 주관식으로 변경**
   - 기존 객관식 형태의 퀴즈 UI를 직접 입력하는 주관식 형태로 변경
   - 입력값과 정답 비교를 위한 로직 개발 필요

2. **상식, 영화관련 질문과 답을 위한 외부 리소스 조회**
   - Google Spreadsheet 연동 구현
   - 실시간으로 질문과 답변을 불러오는 기능 개발
   - 데이터 캐싱 및 오류 처리 로직 필요

3. **사진 질문과 답을 위한 외부 리소스 조회**
   - Google Drive 연동 구현
   - 이미지 데이터를 효율적으로 불러오는 기능 개발
   - 다양한 이미지 형식 지원 및 로딩 상태 처리