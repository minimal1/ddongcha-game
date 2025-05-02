import { useState, useEffect } from 'react';

interface UseQuizDataProps<T> {
  apiEndpoint: string;
}

interface QuizApiResponse<T> {
  questions: T[];
  timeLimit: number;
  zoomInterval?: number; // 얼굴 줌 퀴즈에서만 사용
}

interface UseQuizDataReturn<T> {
  questions: T[];
  timeLimit: number;
  zoomInterval?: number;
  loading: boolean;
  error: Error | null;
}

export function useQuizData<T>({ apiEndpoint }: UseQuizDataProps<T>): UseQuizDataReturn<T> {
  const [data, setData] = useState<QuizApiResponse<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/${apiEndpoint}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch quiz data: ${response.status}`);
        }
        
        const quizData = await response.json();
        setData(quizData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [apiEndpoint]);

  return {
    questions: data?.questions || [],
    timeLimit: data?.timeLimit || 0,
    zoomInterval: data?.zoomInterval,
    loading,
    error
  };
}