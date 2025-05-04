// 일반 퀴즈 문제
export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

// 영화 퀴즈 문제
export interface MovieQuestion {
  id: number;
  type: "title" | "quote";
  content: string;
  correctAnswer: string;
  options: string[];
}

// 얼굴 줌 퀴즈 문제
export interface FaceZoomQuestion {
  id: number;
  imagePath: string;
  zoomLevels: number;
  correctAnswer: string;
  options: string[];
}

// 사진 연도 퀴즈 문제
export interface PhotoYearQuestion {
  id: number;
  imagePath: string;
  minYear: number;
  maxYear: number;
  correctAnswer: number;
  options: number[];
}

// Guess-who 퀴즈 문제
export interface GuessWhoQuestion {
  id: number;
  question: string;
  imagePaths: string[]; // 3장의 사진 경로를 저장하는 배열
  correctAnswer: string;
  options: string[]; // 정답 선택지
}
