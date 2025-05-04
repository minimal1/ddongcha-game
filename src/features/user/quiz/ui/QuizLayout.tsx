import React from 'react';
import Link from 'next/link';
import styles from './QuizLayout.module.css';

interface QuizLayoutProps {
  title: string;
  children: React.ReactNode;
  currentQuestion?: number;
  totalQuestions?: number;
  onBackToDashboard?: () => void;
}

const QuizLayout: React.FC<QuizLayoutProps> = ({
  title,
  children,
  currentQuestion,
  totalQuestions,
  onBackToDashboard
}) => {
  return (
    <div className={styles.quizLayout}>
      <header className={styles.quizHeader}>
        <h1 className={styles.quizTitle}>{title}</h1>
        { currentQuestion !== undefined && totalQuestions !== undefined && (
          <div className={styles.quizProgress}>
            <span>문제 {currentQuestion}/{totalQuestions}</span>
          </div>
        )}
        <Link href="/" className={styles.backButton} onClick={onBackToDashboard}>
          ← 대시보드로 돌아가기
        </Link>
      </header>

      <main className={styles.quizContent}>
        {children}
      </main>
    </div>
  );
};

export default QuizLayout;