import React from 'react';
import { QuestionType } from '@/entities/shared/quiz/model/question-type.model';
import styles from './QuizTypeSelector.module.css';

interface QuizTypeSelectorProps {
  value: QuestionType | '';
  onChange: (value: QuestionType) => void;
  disabled?: boolean;
}

/**
 * 퀴즈 타입 선택기 컴포넌트
 * 
 * 퀴즈 생성/수정 시 퀴즈 타입을 선택하는 카드 UI를 제공합니다.
 */
const QuizTypeSelector: React.FC<QuizTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const quizTypes: { type: QuestionType; title: string; description: string; icon: string }[] = [
    {
      type: 'trivia',
      title: '일반 퀴즈',
      description: '일반적인 지식이나 상식에 관한 퀴즈입니다.',
      icon: '🧠',
    },
    {
      type: 'movie',
      title: '영화 퀴즈',
      description: '영화 명대사나 장면을 통해 영화를 맞추는 퀴즈입니다.',
      icon: '🎬',
    },
    {
      type: 'photo-year',
      title: '연도 퀴즈',
      description: '사진을 보고 촬영된 연도를 맞추는 퀴즈입니다.',
      icon: '📅',
    },
    {
      type: 'guess-who',
      title: '인물 맞추기',
      description: '일부 가려진 인물 사진을 보고 누구인지 맞추는 퀴즈입니다.',
      icon: '👤',
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>퀴즈 유형 선택</h2>
      <p className={styles.description}>만들고자 하는 퀴즈의 유형을 선택하세요</p>
      
      <div className={styles.cardGrid}>
        {quizTypes.map((quizType) => (
          <div
            key={quizType.type}
            className={`${styles.card} ${value === quizType.type ? styles.selected : ''}`}
            onClick={disabled ? undefined : () => onChange(quizType.type)}
            aria-disabled={disabled}
          >
            <div className={styles.cardIcon}>{quizType.icon}</div>
            <h3 className={styles.cardTitle}>{quizType.title}</h3>
            <p className={styles.cardDescription}>{quizType.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizTypeSelector;