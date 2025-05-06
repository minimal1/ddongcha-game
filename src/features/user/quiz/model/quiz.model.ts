import { QuestionType } from "@/entities/shared/quiz/model/question-type.model";

// 기본 퀴즈 인터페이스 (기초 클래스)
export interface QuizQuestion {
  uuid: string; // UUID 형식으로 변경
  questionType: QuestionType;
  question: string;
  answer: string;
  hints?: string[]; // 상황별 힌트
}

// 이미지가 있는 퀴즈 인터페이스 (Photo-year, Guess-who)
export interface ImageQuizQuestion extends QuizQuestion {
  imageUrls: string[]; // 여러 이미지 URL을 저장
}

// 퀴즈 타입별 확장 인터페이스
export interface TriviaQuizQuestion extends QuizQuestion {
  questionType: "trivia";
}

// 영화 퀴즈는 이제 이미지를 포함하도록 ImageQuizQuestion 확장
export interface MovieQuizQuestion extends ImageQuizQuestion {
  questionType: "movie";
}

export interface PhotoYearQuizQuestion extends ImageQuizQuestion {
  questionType: "photo-year";
}

export interface GuessWhoQuizQuestion extends ImageQuizQuestion {
  questionType: "guess-who";
}

// 유니언 타입을 통해 모든 퀴즈 타입 병합
export type Quiz =
  | TriviaQuizQuestion
  | MovieQuizQuestion
  | PhotoYearQuizQuestion
  | GuessWhoQuizQuestion;