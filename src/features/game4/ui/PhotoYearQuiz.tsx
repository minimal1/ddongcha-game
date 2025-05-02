import React from 'react';
import QuizLayout from 'shared/ui/QuizLayout';
import { QuizState } from 'shared/lib/types';
import { useQuiz } from 'shared/lib/useQuiz';
import { photoYearQuestions, PHOTO_YEAR_TIME_LIMIT } from '../config/photoYearQuestions';
import './PhotoYearQuiz.css';

const PhotoYearQuiz: React.FC = () => {
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
    questions: photoYearQuestions,
    timeLimit: PHOTO_YEAR_TIME_LIMIT
  });

  // 퀴즈 시작 화면 렌더링
  const renderStartScreen = () => (
    <div className="start-screen">
      <h2>추억 사진 퀴즈 - 촬영 연도</h2>
      <p>단체 사진의 촬영 연도를 맞추는 게임입니다.</p>
      <p>각 문제당 {PHOTO_YEAR_TIME_LIMIT}초의 시간이 주어집니다.</p>
      <p>총 {photoYearQuestions.length}개의 문제가 출제됩니다.</p>
      <button className="primary" onClick={startQuiz}>게임 시작하기</button>
    </div>
  );

  // 문제 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    const question = currentQuestion as any;
    
    return (
      <div className="question-screen">
        <div className="photo-container">
          <div className="photo-image">
            <div className="image-placeholder">[이미지: {question.imagePath}]</div>
          </div>
        </div>
        
        <div className="question-text">이 단체 사진은 몇 년도에 촬영되었을까요?</div>
        
        <div className="year-range">
          <span>촬영 시기: {question.minYear}년 ~ {question.maxYear}년</span>
        </div>
        
        <div className="options-grid">
          {question.options && question.options.map((option: number, index: number) => (
            <button
              key={index}
              className="option-button"
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
    
    const question = currentQuestion as any;
    
    return (
      <div className="answer-screen">
        <h2 className={isCorrect ? 'correct-answer' : 'wrong-answer'}>
          {isCorrect ? '정답입니다! 👏' : '틀렸습니다! 😢'}
        </h2>
        <div className="photo-container answer-photo">
          <div className="photo-image">
            <div className="image-placeholder">[이미지: {question.imagePath}]</div>
          </div>
        </div>
        <div className="answer-details">
          <p>정답: <strong>{question.correctAnswer}년</strong></p>
          {userAnswer && <p>제출한 답: <strong>{userAnswer}년</strong></p>}
        </div>
        <button className="primary" onClick={nextQuestion}>
          {currentQuestionIndex < photoYearQuestions.length - 1 ? '다음 문제' : '결과 보기'}
        </button>
      </div>
    );
  };

  // 결과 화면 렌더링
  const renderResultScreen = () => (
    <div className="result-screen">
      <h2>퀴즈 결과</h2>
      <div className="score-display">
        <p>총점: <strong>{score}/{photoYearQuestions.length}</strong></p>
        <p>정답률: <strong>{Math.round((score / photoYearQuestions.length) * 100)}%</strong></p>
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
      title="추억 사진 퀴즈 - 촬영 연도"
      currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
      totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? photoYearQuestions.length : undefined}
      timeRemaining={quizState === QuizState.QUESTION ? timeRemaining : undefined}
      isGameOver={quizState === QuizState.FINISHED}
    >
      {renderContent()}
    </QuizLayout>
  );
};

export default PhotoYearQuiz;