import { QuestionType } from "@/entities/shared/quiz/model/question-type.model";
import { QuizRequest } from "../model/quiz-request.model";

/**
 * API 응답 데이터를 폼 필드 형식으로 변환
 */
export interface QuizFormValues {
  questionType: QuestionType;
  question: string;
  answer: string;
  imageUrls: string[];
  hints: string[];
}

/**
 * API 응답 데이터를 폼 필드 형식으로 변환
 */
export const apiToFormValues = (apiData: any): QuizFormValues => {
  return {
    questionType: apiData.question_type,
    question: apiData.question || "",
    answer: apiData.answer || "",
    imageUrls: apiData.image_urls || [],
    hints: apiData.hints || [],
  };
};

/**
 * 폼 필드 데이터를 API 요청 형식으로 변환
 */
export const formToApiValues = (formData: QuizFormValues): QuizRequest => {
  return {
    question_type: formData.questionType,
    question: formData.question,
    answer: formData.answer,
    image_urls: formData.imageUrls,
    hints: formData.hints,
  };
};

/**
 * 퀴즈 유형에 따라 필수 필드 검증
 */
export const validateQuizForm = (values: QuizFormValues): string | null => {
  if (!values.questionType) {
    return "퀴즈 유형을 선택해주세요.";
  }

  if (!values.question.trim()) {
    return "문제를 입력해주세요.";
  }

  if (!values.answer.trim()) {
    return "정답을 입력해주세요.";
  }

  // 이미지가 필요한 퀴즈 타입인데 이미지가 없는 경우
  if (values.questionType !== "trivia" && values.imageUrls.length === 0) {
    return "이미지를 업로드해주세요.";
  }

  return null;
};
