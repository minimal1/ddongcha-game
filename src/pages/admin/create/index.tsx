import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/features/admin/layout/AdminLayout';
import QuizTypeSelector from '@/features/admin/quiz/ui/QuizTypeSelector';
import QuizFormFields from '@/features/admin/quiz/ui/QuizFormFields';
import { QuestionType } from '@/entities/shared/quiz/model/question-type.model';
import { createQuiz } from '@/features/admin/quiz/api/quizAdminApi';
import styles from './Create.module.css';

/**
 * 퀴즈 생성 페이지
 */
const CreateQuizPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 퀴즈 데이터 상태
  const [questionType, setQuestionType] = useState<QuestionType | ''>('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [hints, setHints] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionType) {
      setError('퀴즈 유형을 선택해주세요.');
      return;
    }

    if (!question.trim()) {
      setError('문제를 입력해주세요.');
      return;
    }

    if (!answer.trim()) {
      setError('정답을 입력해주세요.');
      return;
    }

    // 이미지가 필요한 퀴즈 타입인데 이미지가 없는 경우
    if ((questionType === 'photo-year' || questionType === 'guess-who') && imageUrls.length === 0) {
      setError('이미지를 업로드해주세요.');
      return;
    }

    // 힌트에서 빈 값 제거
    const filteredHints = hints.filter((hint) => hint.trim() !== '');

    // 퀴즈 생성 데이터
    const quizData = {
      questionType,
      question: question.trim(),
      answer: answer.trim(),
      hints: filteredHints.length > 0 ? filteredHints : undefined,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    };

    try {
      setLoading(true);
      setError(null);
      
      await createQuiz(quizData);
      
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
    setQuestionType(type);
    setQuestion('');
    setAnswer('');
    setHints([]);
    setImageUrls([]);
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
          value={questionType}
          onChange={handleQuestionTypeChange}
          disabled={loading}
        />

        {/* 퀴즈 유형이 선택된 경우 해당 유형의 필드 표시 */}
        {questionType && (
          <QuizFormFields
            questionType={questionType}
            question={question}
            answer={answer}
            hints={hints}
            imageUrls={imageUrls}
            onQuestionChange={setQuestion}
            onAnswerChange={setAnswer}
            onHintsChange={setHints}
            onImageUrlsChange={setImageUrls}
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
            disabled={loading || !questionType}
          >
            {loading ? '생성 중...' : '퀴즈 생성'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CreateQuizPage;