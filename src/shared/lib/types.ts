// 모든 퀴즈에 공통으로 사용될 타입 정의

// 퀴즈 상태
export enum QuizState {
  READY = 'ready',
  QUESTION = 'question',
  ANSWER = 'answer',
  FINISHED = 'finished'
}

// 기본 퀴즈 문제 인터페이스
export interface BaseQuestion {
  id: number;
  correctAnswer: string | number;
}

// 상식 퀴즈 문제
export interface TriviaQuestion extends BaseQuestion {
  question: string;
  options: string[];
}

// 영화 퀴즈 문제
export interface MovieQuestion extends BaseQuestion {
  type: 'title' | 'quote';
  content: string; // 제목 맞추기면 대사, 대사 맞추기면 영화 이름
  hint?: string;
  options?: string[];
}

// 얼굴 줌 퀴즈 문제
export interface FaceZoomQuestion extends BaseQuestion {
  imagePath: string;
  zoomLevels: number;
  options?: string[];
}

// 사진 연도 퀴즈 문제
export interface PhotoYearQuestion extends BaseQuestion {
  imagePath: string;
  minYear: number;
  maxYear: number;
  options?: number[];
}