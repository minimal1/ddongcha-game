import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/features/admin/layout/AdminLayout';
import QuizFormFields from '@/features/admin/quiz/ui/QuizFormFields';
import { useQuizDetail } from '@/features/admin/quiz/lib/useQuizDetail';
import { validateQuizForm } from '@/features/admin/quiz/lib/quizFormUtils';
import styles from './Detail.module.css';

/**
 * 퀴즈 상세/수정/삭제 페이지
 */
const QuizDetailPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  const [formError, setFormError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // uuid가 문자열인지 확인
  const quizId = Array.isArray(uuid) ? uuid[0] : uuid;
  
  // 퀴즈 상세 정보 훅 사용
  const {
    quiz,
    loading,
    saving,
    deleting,
    error: apiError,
    updateQuiz,
    deleteQuiz,
  } = useQuizDetail(quizId || '');

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quiz) return;
    
    // 폼 유효성 검사
    const validationError = validateQuizForm(quiz);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    
    setFormError(null);
    
    // 퀴즈 업데이트
    const success = await updateQuiz(quiz);
    
    if (success) {
      // 업데이트 성공 시 목록 페이지로 이동할지 확인
      alert('퀴즈가 성공적으로 업데이트되었습니다.');
    }
  };

  // 삭제 확인 모달 표시
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // 삭제 확인
  const handleConfirmDelete = async () => {
    const success = await deleteQuiz();
    
    if (success) {
      // 삭제 성공 시 목록 페이지로 이동
      router.push('/admin');
    }
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // 취소 버튼 클릭 처리
  const handleCancel = () => {
    router.push('/admin');
  };

  // 폼 필드 변경 핸들러
  const handleQuestionChange = (value: string) => {
    if (!quiz) return;
    quiz.question = value;
  };

  const handleAnswerChange = (value: string) => {
    if (!quiz) return;
    quiz.answer = value;
  };

  const handleHintsChange = (values: string[]) => {
    if (!quiz) return;
    quiz.hints = values;
  };

  const handleImageUrlsChange = (urls: string[]) => {
    if (!quiz) return;
    quiz.imageUrls = urls;
  };

  return (
    <AdminLayout title="퀴즈 관리">
      <Head>
        <title>퀴즈 관리 - 관리자</title>
        <meta name="description" content="퀴즈 상세/수정/삭제 페이지" />
      </Head>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>퀴즈 정보를 불러오는 중...</p>
        </div>
      ) : apiError ? (
        <div className={styles.error}>
          <p>{apiError}</p>
          <button
            onClick={() => router.push('/admin')}
            className={styles.errorButton}
          >
            목록으로 돌아가기
          </button>
        </div>
      ) : !quiz ? (
        <div className={styles.error}>
          <p>퀴즈를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push('/admin')}
            className={styles.errorButton}
          >
            목록으로 돌아가기
          </button>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>퀴즈 정보 수정</h2>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleDeleteClick}
                className={styles.deleteButton}
                disabled={saving || deleting}
              >
                퀴즈 삭제
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* 퀴즈 유형 정보 */}
            <div className={styles.quizType}>
              <span className={styles.label}>퀴즈 유형:</span>
              <span className={`${styles.badge} ${styles[quiz.questionType]}`}>
                {quiz.questionType === 'trivia' && '일반 퀴즈'}
                {quiz.questionType === 'movie' && '영화 퀴즈'}
                {quiz.questionType === 'photo-year' && '연도 퀴즈'}
                {quiz.questionType === 'guess-who' && '인물 맞추기 퀴즈'}
              </span>
            </div>

            {/* 퀴즈 필드 */}
            <QuizFormFields
              questionType={quiz.questionType}
              question={quiz.question}
              answer={quiz.answer}
              hints={quiz.hints}
              imageUrls={quiz.imageUrls}
              onQuestionChange={handleQuestionChange}
              onAnswerChange={handleAnswerChange}
              onHintsChange={handleHintsChange}
              onImageUrlsChange={handleImageUrlsChange}
              disabled={saving || deleting}
            />

            {/* 에러 메시지 */}
            {formError && <p className={styles.errorMessage}>{formError}</p>}

            {/* 폼 버튼 */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={saving || deleting}
              >
                취소
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={saving || deleting}
              >
                {saving ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>

          {/* 삭제 확인 모달 */}
          {showDeleteConfirm && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3 className={styles.modalTitle}>퀴즈 삭제 확인</h3>
                <p className={styles.modalMessage}>
                  이 퀴즈를 정말로 삭제하시겠습니까?<br />
                  삭제된 퀴즈는 복구할 수 없습니다.
                </p>
                <div className={styles.modalActions}>
                  <button
                    onClick={handleCancelDelete}
                    className={styles.modalCancelButton}
                    disabled={deleting}
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className={styles.modalDeleteButton}
                    disabled={deleting}
                  >
                    {deleting ? '삭제 중...' : '삭제하기'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default QuizDetailPage;