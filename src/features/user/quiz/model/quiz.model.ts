import { QuestionType } from "@/entities/shared/quiz/model/question-type.model";

// 기본 퀴즈 인터페이스 (공통 필드)
export interface QuizQuestion {
  uuid: string; // UUID 형식으로 변경
  questionType: QuestionType;
  question: string;
  answer: string;
  hints?: string[]; // 선택적 힌트
}

// 이미지가 있는 퀴즈 인터페이스 (Photo-year, Guess-who)
export interface ImageQuizQuestion extends QuizQuestion {
  imageUrls: string[]; // 여러 이미지 URL을 지원
}

// 퀴즈 타입별 특화 인터페이스
export interface TriviaQuizQuestion extends QuizQuestion {
  questionType: "trivia";
}

export interface MovieQuizQuestion extends QuizQuestion {
  questionType: "movie";
}

export interface PhotoYearQuizQuestion extends ImageQuizQuestion {
  questionType: "photo-year";
}

export interface GuessWhoQuizQuestion extends ImageQuizQuestion {
  questionType: "guess-who";
}

// 유니온 타입을 통한 모든 퀴즈 타입 통합
export type Quiz =
  | TriviaQuizQuestion
  | MovieQuizQuestion
  | PhotoYearQuizQuestion
  | GuessWhoQuizQuestion;
