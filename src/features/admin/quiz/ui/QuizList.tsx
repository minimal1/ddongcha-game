import React from 'react';
import { useRouter } from 'next/router';
import { useQuizList } from '../lib/useQuizList';
import QuizListItem from './QuizListItem';
import { QuestionType } from '@/entities/shared/quiz/model/question-type.model';
import styles from './QuizList.module.css';

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
  
  // useQuizList 훅 사용
  const {
    quizzes,
    loading,
    error,
    questionType,
    currentPage,
    totalQuizzes,
    totalPages,
    setQuestionType,
    setCurrentPage,
    refresh,
  } = useQuizList({
    initialQuestionType: initialQuizType,
    initialPage: 1,
    initialLimit: 50,
  });

  // 퀴즈 타입 선택 핸들러
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setQuestionType(value === 'all' ? undefined : value);
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
  const handleEditQuiz = (uuid: string) => {
    router.push(`/admin/${uuid}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <select
            value={questionType || 'all'}
            onChange={handleTypeChange}
            className={styles.typeSelect}
            aria-label="퀴즈 타입 필터"
          >
            <option value="all">모든 타입</option>
            <option value="trivia">일반 퀴즈</option>
            <option value="movie">영화 퀴즈</option>
            <option value="photo-year">연도 퀴즈</option>
            <option value="guess-who">인물 맞추기 퀴즈</option>
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
                  key={quiz.uuid}
                  quiz={{
                    id: quiz.uuid,
                    questionType: quiz.question_type,
                    question: quiz.question,
                    answer: quiz.answer,
                    imageUrls: quiz.image_urls || [],
                    hints: quiz.hints || [],
                    created_at: quiz.created_at,
                  }}
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