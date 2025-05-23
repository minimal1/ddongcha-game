import React from 'react';
import Link from 'next/link';
import styles from './QuizLayout.module.css';

interface QuizLayoutProps {
  title: string;
  children: React.ReactNode;
  currentQuestion?: number;
  totalQuestions?: number;
  onBackToDashboard?: () => void;
  actionButtons?: React.ReactNode; // 각 게임별 액션 버튼을 위한 프로퍼티 추가
}

const QuizLayout: React.FC<QuizLayoutProps> = ({
  title,
  children,
  currentQuestion,
  totalQuestions,
  onBackToDashboard,
  actionButtons
}) => {
  return (
    <div className={styles.quizLayout}>
      <header className={styles.quizHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.quizTitle}>{title}</h1>
          {currentQuestion !== undefined && totalQuestions !== undefined && (
            <div className={styles.quizProgress}>
              <span>문제 {currentQuestion}/{totalQuestions}</span>
            </div>
          )}
        </div>
        
        <div className={styles.headerRight}>
          {/* 게임별 액션 버튼을 헤더 오른쪽에 배치 */}
          {actionButtons && (
            <div className={styles.actionButtonsContainer}>
              {actionButtons}
            </div>
          )}
          <Link href="/" className={styles.backButton} onClick={onBackToDashboard}>
            ← 대시보드로 돌아가기
          </Link>
        </div>
      </header>

      <main className={styles.quizContent}>
        {children}
      </main>
    </div>
  );
};

export default QuizLayout;
