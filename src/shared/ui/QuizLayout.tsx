import React from 'react';
import Link from 'next/link';
import './QuizLayout.css';

interface QuizLayoutProps {
  title: string;
  children: React.ReactNode;
  currentQuestion?: number;
  totalQuestions?: number;
  timeRemaining?: number;
  isGameOver?: boolean;
  onBackToDashboard?: () => void;
}

const QuizLayout: React.FC<QuizLayoutProps> = ({
  title,
  children,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  isGameOver = false,
  onBackToDashboard
}) => {
  return (
    <div className="quiz-layout">
      <header className="quiz-header">
        <h1 className="quiz-title">{title}</h1>
        {!isGameOver && currentQuestion !== undefined && totalQuestions !== undefined && (
          <div className="quiz-progress">
            <span>문제 {currentQuestion}/{totalQuestions}</span>
          </div>
        )}
        {!isGameOver && timeRemaining !== undefined && (
          <div className="quiz-timer">
            <span>남은 시간: {timeRemaining}초</span>
          </div>
        )}
        <Link href="/" className="back-button" onClick={onBackToDashboard}>
          ← 대시보드로 돌아가기
        </Link>
      </header>

      <main className="quiz-content">
        {children}
      </main>
    </div>
  );
};

export default QuizLayout;
