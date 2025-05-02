import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import QuizLayout from '@/components/quiz/QuizLayout';
import { useQuiz, QuizState } from '@/hooks/useQuiz';
import { useQuizData } from '@/hooks/useQuizData';
import { PhotoYearQuestion } from '@/types';
import styles from '@/styles/components/quiz/PhotoYearQuiz.module.css';

const PhotoYearQuizPage: NextPage = () => {
  // API에서 퀴즈 데이터 가져오기
  const { questions, timeLimit, loading, error } = useQuizData<PhotoYearQuestion>({
    apiEndpoint: 'photo-year-quiz'
  });

  // 퀴즈 훅 사용
  const {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    timeRemaining,
    score,
    userAnswer,
    isCorrect,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz
  } = useQuiz<PhotoYearQuestion>({
    questions,
    timeLimit
  });

  // 로딩 화면
  if (loading) {
    return (
      <QuizLayout title="스타 사진 퀴즈 - 촬영 연도">
        <div className={styles.loadingContainer}>
          <p>퀴즈 데이터를 불러오는 중...</p>
        </div>
      </QuizLayout>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <QuizLayout title="스타 사진 퀴즈 - 촬영 연도">
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
      <h2>스타 사진 퀴즈 - 촬영 연도</h2>
      <p>사진이 촬영된 연도를 맞추는 퀴즈입니다.</p>
      <p>각 질문당 {timeLimit}초의 시간이 주어집니다.</p>
      <p>총 {questions.length}개의 질문이 출제됩니다.</p>
      <button className={styles.primaryButton} onClick={startQuiz}>퀴즈 시작하기</button>
    </div>
  );

  // 질문 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={styles.questionScreen}>
        <div className={styles.photoContainer}>
          <div className={styles.photoWrapper}>
            <div className={styles.imagePlaceholder}>
              [이미지: {currentQuestion.imagePath}]
            </div>
          </div>
        </div>
        
        <div className={styles.questionText}>
          <p>이 사진은 언제 촬영되었을까요?</p>
          <p className={styles.yearRange}>
            ({currentQuestion.minYear} ~ {currentQuestion.maxYear} 사이)
          </p>
        </div>
        
        <div className={styles.optionsGrid}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={styles.optionButton}
              onClick={() => submitAnswer(option)}
            >
              {option}년
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 정답 화면 렌더링
  const renderAnswerScreen = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={styles.answerScreen}>
        <h2 className={isCorrect ? styles.correctAnswer : styles.wrongAnswer}>
          {isCorrect ? '정답입니다! 👏' : '틀렸습니다! 😔'}
        </h2>
        
        <div className={styles.photoAnswerContainer}>
          <div className={styles.imagePlaceholder}>
            [이미지: {currentQuestion.imagePath}]
          </div>
        </div>
        
        <div className={styles.answerDetails}>
          <p>정답: <strong>{currentQuestion.correctAnswer}년</strong></p>
          {userAnswer !== null && <p>선택한 답: <strong>{userAnswer}년</strong></p>}
        </div>
        
        <button className={styles.primaryButton} onClick={nextQuestion}>
          {currentQuestionIndex < questions.length - 1 ? '다음 질문' : '결과 보기'}
        </button>
      </div>
    );
  };

  // 결과 화면 렌더링
  const renderResultScreen = () => (
    <div className={styles.resultScreen}>
      <h2>퀴즈 결과</h2>
      <div className={styles.scoreDisplay}>
        <p>점수: <strong>{score}/{questions.length}</strong></p>
        <p>정답률: <strong>{Math.round((score / questions.length) * 100)}%</strong></p>
      </div>
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
        <title>스타 사진 퀴즈 - 촬영 연도 - 똥차레크리에이션 게임</title>
        <meta name="description" content="사진이 촬영된 연도를 맞추는 퀴즈" />
      </Head>
      <QuizLayout
        title="스타 사진 퀴즈 - 촬영 연도"
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

export default PhotoYearQuizPage;