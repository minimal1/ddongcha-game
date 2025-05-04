import { useState, useEffect, useCallback } from 'react';
import { getQuizList } from '../api/quizAdminApi';
import { QuestionType } from '@/entities/shared/quiz/model/question-type.model';

interface UseQuizListParams {
  initialQuestionType?: QuestionType;
  initialPage?: number;
  initialLimit?: number;
}

/**
 * 퀴즈 목록을 관리하는 훅
 */
export const useQuizList = ({
  initialQuestionType,
  initialPage = 1,
  initialLimit = 10,
}: UseQuizListParams = {}) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<string | undefined>(initialQuestionType);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);

  // 퀴즈 목록 로드 함수
  const loadQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { quizzes, total } = await getQuizList({
        questionType,
        page: currentPage,
        limit: itemsPerPage,
      });
      
      setQuizzes(quizzes);
      setTotalQuizzes(total);
      setTotalPages(Math.ceil(total / itemsPerPage));
    } catch (err: any) {
      console.error('퀴즈 목록 로드 오류:', err);
      setError(err.message || '퀴즈 목록을 로드하는 중 오류가 발생했습니다.');
      setQuizzes([]);
      setTotalQuizzes(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [questionType, currentPage, itemsPerPage]);

  // 컴포넌트 마운트 및 필터/페이지 변경 시 퀴즈 목록 로드
  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  // 퀴즈 타입 변경 핸들러
  const handleQuestionTypeChange = useCallback((type: string | undefined) => {
    setQuestionType(type);
    setCurrentPage(1); // 타입 변경 시 첫 페이지로 이동
  }, []);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // 한 페이지당 아이템 수 변경 핸들러
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // 한 페이지당 아이템 수 변경 시 첫 페이지로 이동
  }, []);

  return {
    quizzes,
    loading,
    error,
    questionType,
    currentPage,
    totalQuizzes,
    totalPages,
    itemsPerPage,
    setQuestionType: handleQuestionTypeChange,
    setCurrentPage: handlePageChange,
    setItemsPerPage: handleItemsPerPageChange,
    refresh: loadQuizzes,
  };
};