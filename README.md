# 레크리에이션 게임 웹 애플리케이션

친구들과의 모임이나 레크리에이션 행사에서 사용할 수 있는 간단한 게임 모음 웹 애플리케이션입니다.

## 포함된 게임

1. **상식 퀴즈 배틀**: 다양한 분야의 상식 문제를 푸는 퀴즈 게임입니다.
2. **영화제목, 대사 맞추기**: 유명 영화의 제목과 대사를 맞추는 게임입니다.
3. **추억 사진 퀴즈 - 얼굴 줌 아웃**: 확대된 얼굴 사진을 보고 누구인지 맞추는 게임입니다.
4. **추억 사진 퀴즈 - 촬영 연도**: 단체 사진의 촬영 연도를 맞추는 게임입니다.

## 기술 스택

- React
- TypeScript
- React Router

## 실행 방법

### 개발 모드 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm start
```

### 빌드

```bash
npm run build
```

## 이미지 추가 방법

각 게임에서 사용할 이미지는 다음 위치에 추가해야 합니다:

- 얼굴 줌 아웃 게임: `/public/images/faces/` 디렉토리
- 단체 사진 연도 맞추기 게임: `/public/images/photos/` 디렉토리

이미지 추가 후 해당 게임의 config 파일에서 imagePath를 수정해주세요.

## 게임 설정 변경

각 게임의 설정은 다음 파일에서 수정 가능합니다:

- 상식 퀴즈: `src/features/game1/config/triviaQuestions.ts`
- 영화 퀴즈: `src/features/game2/config/movieQuestions.ts`
- 얼굴 줌 아웃 퀴즈: `src/features/game3/config/faceZoomQuestions.ts`
- 사진 연도 퀴즈: `src/features/game4/config/photoYearQuestions.ts`