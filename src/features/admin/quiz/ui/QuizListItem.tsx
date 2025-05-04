import React from 'react';
import { format } from 'date-fns';
import { QuestionType } from '@/entities/shared/quiz/model/question-type.model';
import styles from './QuizListItem.module.css';

interface Quiz {
  id: string;
  questionType: QuestionType;
  question: string;
  answer: string;
  imageUrls?: string[];
  hints?: string[];
  created_at: string;
}

interface QuizListItemProps {
  quiz: Quiz;
  onEdit: (id: string) => void;
}

/**
 * 퀴즈 목록 아이템 컴포넌트
 * 
 * 퀴즈 목록의 각 행을 표시합니다.
 */
const QuizListItem: React.FC<QuizListItemProps> = ({ quiz, onEdit }) => {
  // 퀴즈 타입 한글 변환
  const getQuizTypeLabel = (type: QuestionType): string => {
    switch (type) {
      case 'trivia':
        return '상식 퀴즈';
      case 'movie':
        return '영화 퀴즈';
      case 'photo-year':
        return '연도 퀴즈';
      case 'guess-who':
        return '인물 퀴즈';
      default:
        return type;
    }
  };

  // 날짜 형식 지정
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return '날짜 오류';
    }
  };

  // 문제 내용 요약 (너무 길면 자르기)
  const truncateText = (text: string, maxLength = 50): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <li className={styles.item}>
      <div className={styles.typeColumn}>
        <span className={`${styles.badge} ${styles[quiz.questionType]}`}>
          {getQuizTypeLabel(quiz.questionType)}
        </span>
      </div>
      
      <div className={styles.questionColumn}>
        <p className={styles.question}>{truncateText(quiz.question)}</p>
        {quiz.imageUrls && quiz.imageUrls.length > 0 && (
          <span className={styles.imageIndicator} title="이미지 포함">
            🖼️
          </span>
        )}
      </div>
      
      <div className={styles.answerColumn}>
        <p className={styles.answer}>{truncateText(quiz.answer, 20)}</p>
      </div>
      
      <div className={styles.dateColumn}>
        <time dateTime={quiz.created_at}>{formatDate(quiz.created_at)}</time>
      </div>
      
      <div className={styles.actionColumn}>
        <button
          onClick={() => onEdit(quiz.id)}
          className={styles.editButton}
          aria-label={`${quiz.question} 퀴즈 수정`}
        >
          수정
        </button>
      </div>
    </li>
  );
};

export default QuizListItem;