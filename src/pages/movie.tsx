import { NextPage } from 'next';
import Head from 'next/head';
import QuizLayout from '@/features/user/quiz/ui/QuizLayout';
import { useQuiz, QuizState } from '@/features/user/quiz/lib/useQuiz';
import { MovieQuizQuestion } from '@/features/user/quiz/model/quiz.model';
import styles from '@/features/user/quiz/ui/MovieQuiz.module.css';
import useQuizData from '@/features/user/quiz/lib/useQuizData';

const MovieQuizPage: NextPage = () => {
  // Supabase에서 영화 퀴즈 데이터 가져오기
  const { questions, loading, error } = useQuizData({
    questionType: 'movie',
    limit: 50,
  });

  // 퀴즈 상태 관리
  const {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    startQuiz,
    showAnswer,
    nextQuestion,
    resetQuiz
  } = useQuiz({
    questions,
  });

  // 퀴즈 시작 화면 렌더링
  const renderStartScreen = () => {
    if (loading) {
      return (
        <div className={styles.startScreen}>
          <h2>영화 퀴즈 데이터 로딩 중...</h2>
          <p>잠시만 기다려주세요.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.startScreen}>
          <h2>오류 발생</h2>
          <p>영화 퀴즈 데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p>{error.message}</p>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className={styles.startScreen}>
          <h2>퀴즈 준비</h2>
          <p>현재 사용 가능한 퀴즈가 없습니다.</p>
        </div>
      );
    }

    return (
      <div className={styles.startScreen}>
        <h2>영화 제목 맞추기</h2>
        <p>유명한 영화의 제목을 맞추는 퀴즈입니다.</p>
        <p>총 {questions.length}개의 문제가 준비되었습니다.</p>
        <button className={styles.primaryButton} onClick={startQuiz}>퀴즈 시작하기</button>
      </div>
    );
  };

  // 문제 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    // 질문 타입에 따라 다른 문구
    const questionType = '이 영화의 유명한 대사는?';
    
    return (
      <div className={styles.questionScreen}>
        <div className={styles.movieQuestion}>
          <div className={styles.movieQuestionType}>{questionType}</div>
          <div className={styles.movieQuestionContent}>
            <p className={styles.movieContent}>{currentQuestion.question}</p>
          </div>
        </div>
        
       
        <button className={styles.primaryButton} onClick={showAnswer}>
          정답 보기
        </button>
      </div>
    );
  };

  // 정답 화면 렌더링
  const renderAnswerScreen = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={styles.answerScreen}>
        <div className={styles.answerDetails}>
          <p>영화 내용: <strong>{currentQuestion.question}</strong></p>
          <p>정답: <strong>{currentQuestion.answer}</strong></p>
        </div>
        <button className={styles.primaryButton} onClick={nextQuestion}>
          {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '결과 보기'}
        </button>
      </div>
    );
  };

  // 결과 화면 렌더링
  const renderResultScreen = () => (
    <div className={styles.resultScreen}>
      <h2>퀴즈 완료</h2>
      <button className={styles.primaryButton} onClick={resetQuiz}>다시 시작하기</button>
    </div>
  );

  // 현재 퀴즈 상태에 따라 적절한 화면 렌더링
  const renderContent = () => {
    switch (quizState) {
      case QuizState.READY:
        return renderStartScreen();
      case QuizState.QUESTION:
        return renderQuestionScreen();
      case QuizState.ANSWER:
        return renderAnswerScreen();
      case QuizState.FINISHED:
        return renderResultScreen();
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>영화 제목 맞추기 - 똥차에이션 퀴즈</title>
        <meta name="description" content="유명 영화의 제목을 맞추는 퀴즈" />
      </Head>
      <QuizLayout
        title="영화 제목 맞추기"
        currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
        totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? questions.length : undefined}
      >
        {renderContent()}
      </QuizLayout>
    </>
  );
};

export default MovieQuizPage;