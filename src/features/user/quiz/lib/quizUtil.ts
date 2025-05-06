import { QuizQuestion } from "../model/quiz.model";

export default function logQuizInfo(quiz: QuizQuestion) {
  console.group(`[${quiz.questionType}] ${quiz.question}`);
  console.log("답:", quiz.answer);
  console.log("힌트:", quiz.hints);
  console.groupEnd();
}
