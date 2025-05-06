import { useState, useCallback, useEffect } from "react";
import { QuizQuestion } from "../model/quiz.model";
import logQuizInfo from "./quizUtil";

// 퀴즈 상태 타입
export enum QuizState {
  READY = "ready",
  QUESTION = "question",
  ANSWER = "answer",
  FINISHED = "finished",
}

interface UseQuizProps<T extends QuizQuestion> {
  questions: T[];
  onFinish?: (totalQuestions: number) => void;
}

interface UseQuizReturn<T extends QuizQuestion> {
  currentQuestion: T | null;
  currentQuestionIndex: number;
  quizState: QuizState;
  startQuiz: () => void;
  showAnswer: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export function useQuiz<T extends QuizQuestion>({
  questions,
  onFinish,
}: UseQuizProps<T>): UseQuizReturn<T> {
  const [quizState, setQuizState] = useState<QuizState>(QuizState.READY);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex] || null;

  const startQuiz = useCallback(() => {
    setQuizState(QuizState.QUESTION);
    setCurrentQuestionIndex(0);
  }, []);

  const showAnswer = useCallback(() => {
    setQuizState(QuizState.ANSWER);
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuizState(QuizState.QUESTION);
    } else {
      setQuizState(QuizState.FINISHED);
      onFinish?.(questions.length);
    }
  }, [currentQuestionIndex, questions.length, onFinish]);

  const resetQuiz = useCallback(() => {
    setQuizState(QuizState.READY);
    setCurrentQuestionIndex(0);
  }, []);

  useEffect(() => {
    if (!currentQuestion || quizState !== QuizState.QUESTION) return;
    logQuizInfo(currentQuestion);
  }, [currentQuestion, quizState]);

  return {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    startQuiz,
    showAnswer,
    nextQuestion,
    resetQuiz,
  };
}
