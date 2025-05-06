import { NextPage } from 'next';
import Head from 'next/head';
import QuizLayout from '@/features/user/quiz/ui/QuizLayout';
import { useQuiz, QuizState } from '@/features/user/quiz/lib/useQuiz';
import useQuizData from '@/features/user/quiz/lib/useQuizData';
import styles from '@/features/user/quiz/ui/TriviaQuiz.module.css';
import React from 'react';

const TriviaQuizPage: NextPage = () => {
  // Supabase에서 퀴즈 데이터 가져오기
  const { questions, loading, error } = useQuizData({
    questionType: 'trivia',
    limit: 50,
  });

  // 퀴즈 관리 사용
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

  // 액션 버튼 렌더링 - 게임 상태에 따라 다른 버튼 표시
  const renderActionButtons = () => {
    switch (quizState) {
      case QuizState.QUESTION:
        return (
          <button 
            className={styles.headerActionButton} 
            onClick={showAnswer}
          >
            정답 보기
          </button>
        );
      case QuizState.ANSWER:
        return (
          <button 
            className={styles.headerActionButton} 
            onClick={nextQuestion}
          >
            {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        );
      case QuizState.FINISHED:
        return (
          <button 
            className={styles.headerActionButton} 
            onClick={resetQuiz}
          >
            다시 시작하기
          </button>
        );
      default:
        return null;
    }
  };

  // 시작 화면 렌더링 - 로딩 중이거나 오류
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

    if (questions.length === 0) {
      return (
        <div className={styles.startScreen}>
          <h2>퀴즈 없음</h2>
          <p>현재 사용 가능한 퀴즈가 없습니다.</p>
        </div>
      );
    }

    return (
      <div className={styles.startScreen}>
        <h2>지식 퀴즈 게임</h2>
        <p>다양한 분야의 지식 문제를 푸는 퀴즈 게임입니다.</p>
        <p>총 {questions.length}개의 문제가 준비되었습니다.</p>
        <button className={styles.primaryButton} onClick={startQuiz}>게임 시작하기</button>
      </div>
    );
  };

  // 문제 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={styles.questionScreen}>
        <h2 className={styles.questionText}>{currentQuestion.question}</h2>
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
          <p>정답: <strong>{currentQuestion.answer}</strong></p>
        </div>
      </div>
    );
  };

  // 결과 화면 렌더링
  const renderResultScreen = () => (
    <div className={styles.resultScreen}>
      <h2>퀴즈 종료</h2>
      <p>총 {questions.length}개의 문제를 모두 풀었습니다!</p>
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
        <title>지식 퀴즈 게임</title>
        <meta name="description" content="다양한 분야의 지식 문제를 푸는 퀴즈 게임" />
      </Head>
      <QuizLayout
        title="지식 퀴즈 게임"
        currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
        totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? questions.length : undefined}
        actionButtons={renderActionButtons()} // 액션 버튼 추가
      >
        {renderContent()}
      </QuizLayout>
    </>
  );
};

export default TriviaQuizPage;
