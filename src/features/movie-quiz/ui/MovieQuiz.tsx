import React from 'react';
import QuizLayout from 'shared/ui/QuizLayout';
import { QuizState } from 'shared/lib/types';
import { useQuiz } from 'shared/lib/useQuiz';
import { movieQuestions, MOVIE_QUIZ_TIME_LIMIT } from '../config/movieQuestions';
import './MovieQuiz.css';

const MovieQuiz: React.FC = () => {
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
    questions: movieQuestions,
    timeLimit: MOVIE_QUIZ_TIME_LIMIT
  });

  // 퀴즈 시작 화면 렌더링
  const renderStartScreen = () => (
    <div className="start-screen">
      <h2>영화제목, 대사 맞추기</h2>
      <p>유명 영화의 제목과 대사를 맞추는 게임입니다.</p>
      <p>각 문제당 {MOVIE_QUIZ_TIME_LIMIT}초의 시간이 주어집니다.</p>
      <p>총 {movieQuestions.length}개의 문제가 출제됩니다.</p>
      <button className="primary" onClick={startQuiz}>게임 시작하기</button>
    </div>
  );

  // 문제 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    const questionType = currentQuestion.type === 'title' 
      ? '이 설명에 해당하는 영화 제목은?' 
      : '이 영화의 유명한 대사는?';
    
    return (
      <div className="question-screen">
        <div className="movie-question">
          <div className="movie-question-type">{questionType}</div>
          <div className="movie-question-content">
            <p className="movie-content">{currentQuestion.content}</p>
          </div>
        </div>
        
        <div className="options-grid">
          {currentQuestion.options && currentQuestion.options.map((option, index) => (
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
    
    return (
      <div className="answer-screen">
        <h2 className={isCorrect ? 'correct-answer' : 'wrong-answer'}>
          {isCorrect ? '정답입니다! 👏' : '틀렸습니다! 😢'}
        </h2>
        <div className="answer-details">
          <p>{currentQuestion.type === 'title' ? '영화 설명' : '영화 제목'}: <strong>{currentQuestion.content}</strong></p>
          <p>정답: <strong>{currentQuestion.correctAnswer}</strong></p>
          {userAnswer && <p>제출한 답: <strong>{userAnswer}</strong></p>}
        </div>
        <button className="primary" onClick={nextQuestion}>
          {currentQuestionIndex < movieQuestions.length - 1 ? '다음 문제' : '결과 보기'}
        </button>
      </div>
    );
  };

  // 결과 화면 렌더링
  const renderResultScreen = () => (
    <div className="result-screen">
      <h2>퀴즈 결과</h2>
      <div className="score-display">
        <p>총점: <strong>{score}/{movieQuestions.length}</strong></p>
        <p>정답률: <strong>{Math.round((score / movieQuestions.length) * 100)}%</strong></p>
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
      title="영화제목, 대사 맞추기"
      currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
      totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? movieQuestions.length : undefined}
      timeRemaining={quizState === QuizState.QUESTION ? timeRemaining : undefined}
      isGameOver={quizState === QuizState.FINISHED}
    >
      {renderContent()}
    </QuizLayout>
  );
};

export default MovieQuiz;