import { QuestionType } from "@/entities/shared/quiz/model/question-type.model";

export type Quiz = {
  uuid: string;
  question_type: QuestionType;
  question: string;
  answer: string;
  image_urls: string[];
  hints: string[];
  created_at: string;
  updated_at: string;
};
