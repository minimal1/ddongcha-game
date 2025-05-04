import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getQuizList } from '../api/quizAdminApi';
import QuizListItem from './QuizListItem';
import { QuestionType } from '@/entities/shared/quiz/model/question-type.model';
import styles from './QuizList.module.css';

interface Quiz {
  id: string;
  questionType: QuestionType;
  question: string;
  answer: string;
  imageUrls?: string[];
  hints?: string[];
  created_at: string;
}

interface QuizListProps {
  initialQuizType?: QuestionType;
}

/**
 * 퀴즈 목록 컴포넌트
 * 
 * 관리자 대시보드에서 퀴즈 목록을 표시합니다.
 * - 퀴즈 타입별 필터링
 * - 페이지네이션
 * - 퀴즈 생성 및 수정 페이지 링크
 */
const QuizList: React.FC<QuizListProps> = ({ initialQuizType }) => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | undefined>(initialQuizType);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50;

  // 퀴즈 목록 로드
  const loadQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { quizzes, total } = await getQuizList(
        {
          page: currentPage,
          limit: itemsPerPage,
          questionType: selectedType,
        }
      );
      
      setQuizzes(quizzes);
      setTotalQuizzes(total);
      setTotalPages(Math.ceil(total / itemsPerPage));
    } catch (err: any) {
      console.error('퀴즈 목록 로드 오류:', err);
      setError(err.message || '퀴즈 목록을 로드하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedType]);

  // 컴포넌트 마운트 및 필터/페이지 변경 시 퀴즈 목록 로드
  useEffect(() => {
    loadQuizzes();
  }, [selectedType, currentPage, loadQuizzes]);

  // 퀴즈 타입 선택 핸들러
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedType(value === 'all' ? undefined : value);
    setCurrentPage(1); // 타입 변경 시 첫 페이지로 이동
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 새 퀴즈 생성 페이지로 이동
  const handleCreateQuiz = () => {
    router.push('/admin/create');
  };

  // 퀴즈 편집 페이지로 이동
  const handleEditQuiz = (id: string) => {
    router.push(`/admin/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <select
            value={selectedType || 'all'}
            onChange={handleTypeChange}
            className={styles.typeSelect}
            aria-label="퀴즈 타입 필터"
          >
            <option value="all">모든 타입</option>
            <option value="trivia">Trivia Quiz</option>
            <option value="movie">Movie Quiz</option>
            <option value="photo-year">Photo-year Quiz</option>
            <option value="guess-who">Guess-who Quiz</option>
          </select>
        </div>
        
        <button
          onClick={handleCreateQuiz}
          className={styles.createButton}
        >
          새 퀴즈 추가
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>퀴즈 목록을 불러오는 중...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>등록된 퀴즈가 없습니다.</p>
          <button
            onClick={handleCreateQuiz}
            className={styles.emptyStateButton}
          >
            첫 퀴즈 만들기
          </button>
        </div>
      ) : (
        <>
          <div className={styles.listContainer}>
            <div className={styles.listHeader}>
              <div className={styles.typeColumn}>타입</div>
              <div className={styles.questionColumn}>문제</div>
              <div className={styles.answerColumn}>정답</div>
              <div className={styles.dateColumn}>등록일</div>
              <div className={styles.actionColumn}>관리</div>
            </div>
            
            <ul className={styles.list}>
              {quizzes.map((quiz) => (
                <QuizListItem
                  key={quiz.id}
                  quiz={quiz}
                  onEdit={handleEditQuiz}
                />
              ))}
            </ul>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
                aria-label="이전 페이지"
              >
                &lt;
              </button>
              
              <span className={styles.pageInfo}>
                {currentPage} / {totalPages} 페이지
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
                aria-label="다음 페이지"
              >
                &gt;
              </button>
            </div>
          )}
          
          <div className={styles.summary}>
            총 {totalQuizzes}개의 퀴즈
          </div>
        </>
      )}
    </div>
  );
};

export default QuizList;