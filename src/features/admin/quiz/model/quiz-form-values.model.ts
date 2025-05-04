import { QuestionType } from "@/entities/shared/quiz/model/question-type.model";

// 퀴즈 생성/수정을 위한 FORM 인터페이스
export interface QuizFormValues {
  questionType: QuestionType;
  question: string;
  imageUrls?: string[];
  answer: string;
  hints?: string[];
}
