import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/features/admin/layout/AdminLayout';
import QuizFormFields from '@/features/admin/quiz/ui/QuizFormFields';
import { useQuizDetail } from '@/features/admin/quiz/lib/useQuizDetail';
import { validateQuizForm, QuizFormValues } from '@/features/admin/quiz/lib/quizFormUtils';
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

  // 폼 필드 변경 핸들러 - 로컬 상태 업데이트로 수정
  const handleQuestionChange = (value: string) => {
    if (!quiz) return;
    // 새 객체를 만들어 setQuiz를 호출하여 상태 업데이트
    setQuiz({
      ...quiz,
      question: value
    });
  };

  const handleAnswerChange = (value: string) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      answer: value
    });
  };

  const handleHintsChange = (values: string[]) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      hints: values
    });
  };

  const handleImageUrlsChange = (urls: string[]) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      imageUrls: urls
    });
  };

  // Quiz 상태를 업데이트하는 함수를 추가
  const setQuiz = (newQuizValue: QuizFormValues) => {
    // useQuizDetail 훅의 내부 상태 업데이트
    if (window.temp_quiz_state) {
      window.temp_quiz_state = newQuizValue;
      // 강제 리렌더링을 위한 상태 업데이트 트릭
      forceUpdate();
    }
  };

  // 강제 리렌더링을 위한 상태
  const [, forceRender] = useState({});
  const forceUpdate = () => forceRender({});

  // quiz 상태를 임시 전역 변수에 저장
  if (quiz && !window.temp_quiz_state) {
    window.temp_quiz_state = quiz;
  }

  // 실제 사용할 퀴즈 데이터 (window.temp_quiz_state가 있으면 그것을 사용)
  const currentQuiz = window.temp_quiz_state || quiz;

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
      ) : !currentQuiz ? (
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
              <span className={`${styles.badge} ${styles[currentQuiz.questionType]}`}>
                {currentQuiz.questionType === 'trivia' && '일반 퀴즈'}
                {currentQuiz.questionType === 'movie' && '영화 퀴즈'}
                {currentQuiz.questionType === 'photo-year' && '연도 퀴즈'}
                {currentQuiz.questionType === 'guess-who' && '인물 맞추기 퀴즈'}
              </span>
            </div>

            {/* 퀴즈 필드 */}
            <QuizFormFields
              questionType={currentQuiz.questionType}
              question={currentQuiz.question}
              answer={currentQuiz.answer}
              hints={currentQuiz.hints}
              imageUrls={currentQuiz.imageUrls}
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

// TypeScript에서 window 객체에 임시 상태 저장을 위한 타입 정의
declare global {
  interface Window {
    temp_quiz_state: any;
  }
}

export default QuizDetailPage;