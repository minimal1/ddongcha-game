import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/features/admin/layout/AdminLayout';
import QuizTypeSelector from '@/features/admin/quiz/ui/QuizTypeSelector';
import QuizFormFields from '@/features/admin/quiz/ui/QuizFormFields';
import { QuestionType } from '@/entities/shared/quiz/model/question-type.model';
import { createQuiz } from '@/features/admin/quiz/api/quizAdminApi';
import styles from './Create.module.css';
import { QuizFormValues, formToApiValues, validateQuizForm } from '@/features/admin/quiz/lib/quizFormUtils';

/**
 * 퀴즈 생성 페이지
 */
const CreateQuizPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 퀴즈 데이터 상태
  const [formValues, setFormValues] = useState<QuizFormValues>({
    questionType: '' as QuestionType,
    question: '',
    answer: '',
    hints: [],
    imageUrls: [],
  });

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    const validationError = validateQuizForm(formValues);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 폼 데이터를 API 형식으로 변환하여 전송
      const apiData = formToApiValues(formValues);
      await createQuiz(apiData);
      
      // 성공 후 목록 페이지로 이동
      router.push('/admin');
    } catch (err: any) {
      console.error('퀴즈 생성 오류:', err);
      setError(err.message || '퀴즈 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 취소 버튼 클릭 처리
  const handleCancel = () => {
    router.push('/admin');
  };

  // 퀴즈 유형 변경 시 필드 초기화
  const handleQuestionTypeChange = (type: QuestionType) => {
    setFormValues({
      questionType: type,
      question: '',
      answer: '',
      hints: [],
      imageUrls: [],
    });
  };

  // 각 필드 변경 핸들러
  const handleQuestionChange = (value: string) => {
    setFormValues(prev => ({
      ...prev,
      question: value
    }));
  };

  const handleAnswerChange = (value: string) => {
    setFormValues(prev => ({
      ...prev,
      answer: value
    }));
  };

  const handleHintsChange = (values: string[]) => {
    setFormValues(prev => ({
      ...prev,
      hints: values
    }));
  };

  const handleImageUrlsChange = (urls: string[]) => {
    setFormValues(prev => ({
      ...prev,
      imageUrls: urls
    }));
  };

  return (
    <AdminLayout title="새 퀴즈 만들기">
      <Head>
        <title>퀴즈 생성 - 관리자</title>
        <meta name="description" content="새로운 퀴즈를 생성합니다." />
      </Head>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 퀴즈 유형 선택 */}
        <QuizTypeSelector
          value={formValues.questionType}
          onChange={handleQuestionTypeChange}
          disabled={loading}
        />

        {/* 퀴즈 유형이 선택된 경우 해당 유형의 필드 표시 */}
        {formValues.questionType && (
          <QuizFormFields
            questionType={formValues.questionType}
            question={formValues.question}
            answer={formValues.answer}
            hints={formValues.hints}
            imageUrls={formValues.imageUrls}
            onQuestionChange={handleQuestionChange}
            onAnswerChange={handleAnswerChange}
            onHintsChange={handleHintsChange}
            onImageUrlsChange={handleImageUrlsChange}
            disabled={loading}
          />
        )}

        {/* 에러 메시지 */}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* 폼 버튼 */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !formValues.questionType}
          >
            {loading ? '생성 중...' : '퀴즈 생성'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CreateQuizPage;