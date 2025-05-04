import { useState, useCallback } from "react";

// 퀴즈 상태 타입
export enum QuizState {
  READY = "ready",
  QUESTION = "question",
  ANSWER = "answer",
  FINISHED = "finished",
}

// 기본 퀴즈 문제 인터페이스
export interface BaseQuestion {
  id: number;
  correctAnswer: string | number;
}

interface UseQuizProps<T extends BaseQuestion> {
  questions: T[];
  onFinish?: (totalQuestions: number) => void;
}

interface UseQuizReturn<T extends BaseQuestion> {
  currentQuestion: T | null;
  currentQuestionIndex: number;
  quizState: QuizState;
  startQuiz: () => void;
  showAnswer: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export function useQuiz<T extends BaseQuestion>({
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
