import React, { useState, useEffect } from 'react';
import QuizLayout from 'shared/ui/QuizLayout';
import { QuizState } from 'shared/lib/types';
import { useQuiz } from 'shared/lib/useQuiz';
import { faceZoomQuestions, FACE_ZOOM_TIME_LIMIT, ZOOM_INTERVAL } from '../config/faceZoomQuestions';
import './FaceZoomQuiz.css';

const FaceZoomQuiz: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(0);
  
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
  } = useQuiz({
    questions: faceZoomQuestions,
    timeLimit: FACE_ZOOM_TIME_LIMIT
  });

  // 줌 레벨 효과
  useEffect(() => {
    if (quizState === QuizState.QUESTION && currentQuestion) {
      // 처음에는 얼굴이 가장 확대된 상태(zoomLevel = 0)에서 시작
      setZoomLevel(0);
      
      // 최대 zoomLevels만큼, 5초마다 점점 줌 아웃
      const maxZoomLevels = (currentQuestion as any).zoomLevels;
      
      const zoomTimer = setInterval(() => {
        setZoomLevel(prev => {
          if (prev < maxZoomLevels - 1) {
            return prev + 1;
          }
          // 최대 줌 레벨에 도달하면 타이머 해제
          clearInterval(zoomTimer);
          return prev;
        });
      }, ZOOM_INTERVAL * 1000);
      
      return () => clearInterval(zoomTimer);
    }
  }, [quizState, currentQuestion]);

  // 문제 상태가 변경될 때 줌 레벨 초기화
  useEffect(() => {
    if (quizState === QuizState.QUESTION) {
      setZoomLevel(0);
    }
  }, [currentQuestionIndex, quizState]);

  // 퀴즈 시작 화면 렌더링
  const renderStartScreen = () => (
    <div className="start-screen">
      <h2>추억 사진 퀴즈 - 얼굴 줌 아웃</h2>
      <p>확대된 얼굴 사진에서 점점 줌 아웃되며 누구인지 맞추는 게임입니다.</p>
      <p>각 문제당 {FACE_ZOOM_TIME_LIMIT}초의 시간이 주어지며, {ZOOM_INTERVAL}초마다 줌이 아웃됩니다.</p>
      <p>총 {faceZoomQuestions.length}개의 문제가 출제됩니다.</p>
      <button className="primary" onClick={startQuiz}>게임 시작하기</button>
    </div>
  );

  // 문제 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    const question = currentQuestion as any;
    const zoomClass = `zoom-level-${zoomLevel}`;
    
    return (
      <div className="question-screen">
        <div className="face-zoom-container">
          <div className={`face-image ${zoomClass}`}>
            <div className="image-placeholder">[이미지: {question.imagePath}]</div>
          </div>
          <div className="zoom-indicator">
            <div className="zoom-bar">
              <div 
                className="zoom-progress" 
                style={{ width: `${(zoomLevel / (question.zoomLevels - 1)) * 100}%` }}
              ></div>
            </div>
            <span>줌 레벨: {zoomLevel + 1}/{question.zoomLevels}</span>
          </div>
        </div>
        
        <div className="question-text">이 사진 속 인물은 누구인가요?</div>
        
        <div className="options-grid">
          {question.options && question.options.map((option: string, index: number) => (
            <button
              key={index}
              className="option-button"
              onClick={() => submitAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 정답 화면 렌더링
  const renderAnswerScreen = () => {
    if (!currentQuestion) return null;
    
    const question = currentQuestion as any;
    
    return (
      <div className="answer-screen">
        <h2 className={isCorrect ? 'correct-answer' : 'wrong-answer'}>
          {isCorrect ? '정답입니다! 👏' : '틀렸습니다! 😢'}
        </h2>
        <div className="face-full-image">
          <div className="image-placeholder">[이미지: {question.imagePath} - 전체 이미지]</div>
        </div>
        <div className="answer-details">
          <p>정답: <strong>{question.correctAnswer}</strong></p>
          {userAnswer && <p>제출한 답: <strong>{userAnswer}</strong></p>}
        </div>
        <button className="primary" onClick={nextQuestion}>
          {currentQuestionIndex < faceZoomQuestions.length - 1 ? '다음 문제' : '결과 보기'}
        </button>
      </div>
    );
  };

  // 결과 화면 렌더링
  const renderResultScreen = () => (
    <div className="result-screen">
      <h2>퀴즈 결과</h2>
      <div className="score-display">
        <p>총점: <strong>{score}/{faceZoomQuestions.length}</strong></p>
        <p>정답률: <strong>{Math.round((score / faceZoomQuestions.length) * 100)}%</strong></p>
      </div>
      <button className="primary" onClick={resetQuiz}>다시 시작하기</button>
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
    <QuizLayout
      title="추억 사진 퀴즈 - 얼굴 줌 아웃"
      currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
      totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? faceZoomQuestions.length : undefined}
      timeRemaining={quizState === QuizState.QUESTION ? timeRemaining : undefined}
      isGameOver={quizState === QuizState.FINISHED}
    >
      {renderContent()}
    </QuizLayout>
  );
};

export default FaceZoomQuiz;