import { useState, useEffect, useCallback } from 'react';

// 퀴즈 상태 타입
export enum QuizState {
  READY = 'ready',
  QUESTION = 'question',
  ANSWER = 'answer',
  FINISHED = 'finished'
}

// 기본 퀴즈 문제 인터페이스
export interface BaseQuestion {
  id: number;
  correctAnswer: string | number;
}

interface UseQuizProps<T extends BaseQuestion> {
  questions: T[];
  timeLimit: number;
  onFinish?: (score: number, totalQuestions: number) => void;
}

interface UseQuizReturn<T extends BaseQuestion> {
  currentQuestion: T | null;
  currentQuestionIndex: number;
  quizState: QuizState;
  timeRemaining: number;
  score: number;
  userAnswer: string | number | null;
  isCorrect: boolean | null;
  startQuiz: () => void;
  submitAnswer: (answer: string | number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export function useQuiz<T extends BaseQuestion>({
  questions,
  timeLimit,
  onFinish
}: UseQuizProps<T>): UseQuizReturn<T> {
  const [quizState, setQuizState] = useState<QuizState>(QuizState.READY);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [userAnswer, setUserAnswer] = useState<string | number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = questions[currentQuestionIndex] || null;

  // 타이머 처리
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (quizState === QuizState.QUESTION && timeRemaining > 0) {
      timerId = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (quizState === QuizState.QUESTION && timeRemaining === 0) {
      // 시간이 다 되면 자동으로 오답 처리
      setQuizState(QuizState.ANSWER);
      setIsCorrect(false);
    }
    
    return () => clearTimeout(timerId);
  }, [quizState, timeRemaining]);

  const startQuiz = useCallback(() => {
    setQuizState(QuizState.QUESTION);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeRemaining(timeLimit);
    setUserAnswer(null);
    setIsCorrect(null);
  }, [timeLimit]);

  const submitAnswer = useCallback((answer: string | number) => {
    setUserAnswer(answer);
    
    const isAnswerCorrect = 
      String(answer).toLowerCase() === String(currentQuestion?.correctAnswer).toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }
    
    setQuizState(QuizState.ANSWER);
  }, [currentQuestion]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuizState(QuizState.QUESTION);
      setTimeRemaining(timeLimit);
      setUserAnswer(null);
      setIsCorrect(null);
    } else {
      setQuizState(QuizState.FINISHED);
      onFinish?.(score, questions.length);
    }
  }, [currentQuestionIndex, questions.length, timeLimit, score, onFinish]);

  const resetQuiz = useCallback(() => {
    setQuizState(QuizState.READY);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeRemaining(timeLimit);
    setUserAnswer(null);
    setIsCorrect(null);
  }, [timeLimit]);

  return {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    timeRemaining,
    score,
    userAnswer,
    isCorrect,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz
  };
}