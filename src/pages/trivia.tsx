import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import QuizLayout from '@/features/user/quiz/ui/QuizLayout';
import { useQuiz, QuizState } from '@/features/user/quiz/lib/useQuiz';
import useQuizData from '@/features/user/quiz/lib/useQuizData';
import styles from '@/features/user/quiz/ui/TriviaQuiz.module.css';
import { Quiz } from '@/features/user/quiz/model/quiz.model';

// 변환 어댑터: API 데이터를 useQuiz에서 사용하는 형식으로 변환
const adaptQuizData = (quizData: Quiz[]) => {
  return quizData.map((quiz, index) => ({
    id: index, // id를 인덱스로 대체 (useQuiz에서는 숫자 id 사용)
    question: quiz.question,
    correctAnswer: quiz.answer,
    // 필요한 경우 더 많은 필드 추가
  }));
};

const TriviaQuizPage: NextPage = () => {
  // Supabase에서 퀴즈 데이터 가져오기
  const { questions: apiQuestions, loading, error } = useQuizData({
    questionType: 'trivia',
    limit: 10,
  });

  // 변환된 질문 상태
  const [adaptedQuestions, setAdaptedQuestions] = useState<any[]>([]);

  // API 데이터가 로드되면 형식 변환
  useEffect(() => {
    if (apiQuestions.length > 0) {
      setAdaptedQuestions(adaptQuizData(apiQuestions));
    }
  }, [apiQuestions]);

  // 퀴즈 훅 사용
  const {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    startQuiz,
    showAnswer,
    nextQuestion,
    resetQuiz
  } = useQuiz({
    questions: adaptedQuestions,
  });

  // 시작 화면 렌더링 - 로딩 상태 추가
  const renderStartScreen = () => {
    if (loading) {
      return (
        <div className={styles.startScreen}>
          <h2>퀴즈 데이터 로딩 중...</h2>
          <p>잠시만 기다려주세요.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.startScreen}>
          <h2>오류 발생</h2>
          <p>퀴즈 데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p>{error.message}</p>
        </div>
      );
    }

    if (adaptedQuestions.length === 0) {
      return (
        <div className={styles.startScreen}>
          <h2>퀴즈 준비</h2>
          <p>현재 사용 가능한 퀴즈가 없습니다.</p>
        </div>
      );
    }

    return (
      <div className={styles.startScreen}>
        <h2>지식 퀴즈 게임</h2>
        <p>다양한 분야의 지식 질문을 푸는 퀴즈 게임입니다.</p>
        <p>총 {adaptedQuestions.length}개의 질문이 준비되었습니다.</p>
        <button className={styles.primaryButton} onClick={startQuiz}>게임 시작하기</button>
      </div>
    );
  };

  // 질문 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={styles.questionScreen}>
        <h2 className={styles.questionText}>{currentQuestion.question}</h2>
       
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
          <p>질문: {currentQuestion.question}</p>
          <p>정답: <strong>{currentQuestion.correctAnswer}</strong></p>
          
          {/* API에서 가져온 원본 데이터의 힌트 표시 */}
          {apiQuestions[currentQuestionIndex]?.hints && apiQuestions[currentQuestionIndex].hints.length > 0 && (
            <div className={styles.hints}>
              <p>힌트:</p>
              <ul>
                {apiQuestions[currentQuestionIndex].hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button className={styles.primaryButton} onClick={nextQuestion}>
          {currentQuestionIndex < adaptedQuestions.length - 1 ? '다음 질문' : '결과 보기'}
        </button>
      </div>
    );
  };

  // 결과 화면 렌더링
  const renderResultScreen = () => (
    <div className={styles.resultScreen}>
      <h2>퀴즈 완료</h2>
      <p>총 {adaptedQuestions.length}개의 문제를 모두 풀었습니다!</p>
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
        <title>지식 퀴즈 게임 - 똥차에이트 게임</title>
        <meta name="description" content="다양한 분야의 지식 질문을 푸는 퀴즈 게임" />
      </Head>
      <QuizLayout
        title="지식 퀴즈 게임"
        currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
        totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? adaptedQuestions.length : undefined}
      >
        {renderContent()}
      </QuizLayout>
    </>
  );
};

export default TriviaQuizPage;