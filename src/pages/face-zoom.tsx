import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import QuizLayout from '@/components/quiz/QuizLayout';
import { useQuiz, QuizState } from '@/hooks/useQuiz';
import { useQuizData } from '@/hooks/useQuizData';
import { FaceZoomQuestion } from '@/types';
import styles from '@/styles/components/quiz/FaceZoomQuiz.module.css';

const FaceZoomQuizPage: NextPage = () => {
  const [zoomLevel, setZoomLevel] = useState(0);

  // API에서 퀴즈 데이터 가져오기
  const { questions, timeLimit, zoomInterval, loading, error } = useQuizData<FaceZoomQuestion>({
    apiEndpoint: 'face-zoom-quiz'
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
  } = useQuiz<FaceZoomQuestion>({
    questions,
    timeLimit
  });

  // 줌 레벨 효과
  useEffect(() => {
    if (quizState === QuizState.QUESTION && currentQuestion && zoomInterval) {
      // 처음에는 얼굴이 가장 확대된 상태(zoomLevel = 0)에서 시작
      setZoomLevel(0);
      
      // 최대 zoomLevels만큼, zoomInterval초마다 점점 줌 아웃
      const maxZoomLevels = currentQuestion.zoomLevels;
      
      const zoomTimer = setInterval(() => {
        setZoomLevel(prev => {
          if (prev < maxZoomLevels - 1) {
            return prev + 1;
          }
          // 최대 줌 레벨에 도달하면 타이머 해제
          clearInterval(zoomTimer);
          return prev;
        });
      }, zoomInterval * 1000);
      
      return () => clearInterval(zoomTimer);
    }
  }, [quizState, currentQuestion, zoomInterval]);

  // 문제 상태가 변경될 때 줌 레벨 초기화
  useEffect(() => {
    if (quizState === QuizState.QUESTION) {
      setZoomLevel(0);
    }
  }, [currentQuestionIndex, quizState]);

  // 로딩 화면
  if (loading) {
    return (
      <QuizLayout title="추억 사진 퀴즈 - 얼굴 줌 아웃">
        <div className={styles.loadingContainer}>
          <p>퀴즈 데이터를 불러오는 중...</p>
        </div>
      </QuizLayout>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <QuizLayout title="추억 사진 퀴즈 - 얼굴 줌 아웃">
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
      <h2>추억 사진 퀴즈 - 얼굴 줌 아웃</h2>
      <p>확대된 얼굴 사진에서 점점 줌 아웃되며 누구인지 맞추는 게임입니다.</p>
      <p>각 문제당 {timeLimit}초의 시간이 주어지며, {zoomInterval}초마다 줌이 아웃됩니다.</p>
      <p>총 {questions.length}개의 문제가 출제됩니다.</p>
      <button className={styles.primaryButton} onClick={startQuiz}>게임 시작하기</button>
    </div>
  );

  // 문제 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    const zoomClass = styles[`zoomLevel${zoomLevel}`];
    
    return (
      <div className={styles.questionScreen}>
        <div className={styles.faceZoomContainer}>
          <div className={`${styles.faceImage} ${zoomClass}`}>
            <div className={styles.imagePlaceholder}>
              [이미지: {currentQuestion.imagePath}]
            </div>
          </div>
          <div className={styles.zoomIndicator}>
            <div className={styles.zoomBar}>
              <div 
                className={styles.zoomProgress} 
                style={{ width: `${(zoomLevel / (currentQuestion.zoomLevels - 1)) * 100}%` }}
              ></div>
            </div>
            <span>줌 레벨: {zoomLevel + 1}/{currentQuestion.zoomLevels}</span>
          </div>
        </div>
        
        <div className={styles.questionText}>이 사진 속 인물은 누구인가요?</div>
        
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
        <div className={styles.faceFullImage}>
          <div className={styles.imagePlaceholder}>
            [이미지: {currentQuestion.imagePath} - 전체 이미지]
          </div>
        </div>
        <div className={styles.answerDetails}>
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
        <title>추억 사진 퀴즈 - 얼굴 줌 아웃 - 레크리에이션 게임</title>
        <meta name="description" content="확대된 얼굴 사진을 보고 누구인지 맞추는 게임" />
      </Head>
      <QuizLayout
        title="추억 사진 퀴즈 - 얼굴 줌 아웃"
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

export default FaceZoomQuizPage;