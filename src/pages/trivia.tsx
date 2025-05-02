import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import QuizLayout from '@/components/quiz/QuizLayout';
import { useQuiz, QuizState } from '@/hooks/useQuiz';
import { useQuizData } from '@/hooks/useQuizData';
import styles from '@/styles/components/quiz/TriviaQuiz.module.css';

type TriviaQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

const TriviaQuizPage: NextPage = () => {
  // API에서 퀴즈 데이터 가져오기
  const { questions, timeLimit, loading, error } = useQuizData<TriviaQuestion>({
    apiEndpoint: 'trivia-quiz'
  });

  // 퀴즈 훅 사용
  const {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    timeRemaining,
    startQuiz,
    showAnswer,
    nextQuestion,
    resetQuiz
  } = useQuiz<TriviaQuestion>({
    questions,
    timeLimit
  });

  // 로딩 화면
  if (loading) {
    return (
      <QuizLayout title="상식 퀴즈 배틀">
        <div className={styles.loadingContainer}>
          <p>퀴즈 데이터를 불러오는 중...</p>
        </div>
      </QuizLayout>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <QuizLayout title="상식 퀴즈 배틀">
        <div className={styles.errorMessage}>
          <p>퀴즈 데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p>{error.message}</p>
        </div>
      </QuizLayout>
    );
  }

  // 퀴즈 시작 화면 렌더링
  const renderStartScreen = () => (
    <div className={styles.startScreen}>
      <h2>상식 퀴즈 배틀</h2>
      <p>다양한 분야의 상식 문제를 푸는 퀴즈 게임입니다.</p>
      <p>각 문제당 {timeLimit}초의 시간이 주어집니다.</p>
      <p>총 {questions.length}개의 문제가 출제됩니다.</p>
      <button className={styles.primaryButton} onClick={startQuiz}>게임 시작하기</button>
    </div>
  );

  // 문제 화면 렌더링
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
          <p>문제: {currentQuestion.question}</p>
          <p>정답: <strong>{currentQuestion.correctAnswer}</strong></p>
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
      <h2>퀴즈 종료</h2>
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
        <title>상식 퀴즈 배틀 - 레크리에이션 게임</title>
        <meta name="description" content="다양한 분야의 상식 문제를 푸는 퀴즈 게임" />
      </Head>
      <QuizLayout
        title="상식 퀴즈 배틀"
        currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
        totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? questions.length : undefined}
        timeRemaining={quizState === QuizState.QUESTION ? timeRemaining : undefined}
        isGameOver={quizState === QuizState.FINISHED}
      >
        {renderContent()}
      </QuizLayout>
    </>
  );
};

export default TriviaQuizPage;