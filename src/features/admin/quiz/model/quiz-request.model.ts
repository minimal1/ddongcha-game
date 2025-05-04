import { QuestionType } from "@/entities/shared/quiz/model/question-type.model";

// 퀴즈 생성/수정을 위한 요청 인터페이스
export interface QuizRequest {
  question_type: QuestionType;
  question: string;
  answer: string;
  image_urls: string[];
  hints: string[];
}
