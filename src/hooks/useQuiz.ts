import { useState, useEffect, useCallback } from "react";

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
  timeLimit: number;
  onFinish?: (totalQuestions: number) => void;
}

interface UseQuizReturn<T extends BaseQuestion> {
  currentQuestion: T | null;
  currentQuestionIndex: number;
  quizState: QuizState;
  timeRemaining: number;
  startQuiz: () => void;
  showAnswer: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export function useQuiz<T extends BaseQuestion>({
  questions,
  timeLimit,
  onFinish,
}: UseQuizProps<T>): UseQuizReturn<T> {
  const [quizState, setQuizState] = useState<QuizState>(QuizState.READY);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  const currentQuestion = questions[currentQuestionIndex] || null;

  // 타이머 처리
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (quizState === QuizState.QUESTION && timeRemaining > 0) {
      timerId = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (quizState === QuizState.QUESTION && timeRemaining === 0) {
      // 시간이 다 되면 자동으로 오답 처리
      setQuizState(QuizState.ANSWER);
    }

    return () => clearTimeout(timerId);
  }, [quizState, timeRemaining]);

  const startQuiz = useCallback(() => {
    setQuizState(QuizState.QUESTION);
    setCurrentQuestionIndex(0);
    setTimeRemaining(timeLimit);
  }, [timeLimit]);

  const showAnswer = useCallback(() => {
    setQuizState(QuizState.ANSWER);
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuizState(QuizState.QUESTION);
      setTimeRemaining(timeLimit);
    } else {
      setQuizState(QuizState.FINISHED);
      onFinish?.(questions.length);
    }
  }, [currentQuestionIndex, questions.length, timeLimit, onFinish]);

  const resetQuiz = useCallback(() => {
    setQuizState(QuizState.READY);
    setCurrentQuestionIndex(0);
    setTimeRemaining(timeLimit);
  }, [timeLimit]);

  return {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    timeRemaining,
    startQuiz,
    showAnswer,
    nextQuestion,
    resetQuiz,
  };
}
