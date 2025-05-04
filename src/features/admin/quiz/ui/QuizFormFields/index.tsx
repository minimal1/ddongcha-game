import React from 'react';
import { QuestionType } from '@/entities/shared/quiz/model/question-type.model';
import TriviaFields from './TriviaFields';
import MovieFields from './MovieFields';
import PhotoYearFields from './PhotoYearFields';
import GuessWhoFields from './GuessWhoFields';
import styles from './QuizFormFields.module.css';

interface QuizFormFieldsProps {
  questionType: QuestionType;
  question: string;
  answer: string;
  hints: string[];
  imageUrls: string[];
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onHintsChange: (values: string[]) => void;
  onImageUrlsChange: (urls: string[]) => void;
  disabled?: boolean;
}

/**
 * 퀴즈 폼 필드 통합 컴포넌트
 * 
 * 선택된 퀴즈 타입에 따라 적절한 폼 필드 컴포넌트를 렌더링합니다.
 */
const QuizFormFields: React.FC<QuizFormFieldsProps> = ({
  questionType,
  question,
  answer,
  hints,
  imageUrls,
  onQuestionChange,
  onAnswerChange,
  onHintsChange,
  onImageUrlsChange,
  disabled = false,
}) => {
  // 공통 props
  const commonProps = {
    question,
    answer,
    hints,
    onQuestionChange,
    onAnswerChange,
    onHintsChange,
    disabled,
  };

  // 이미지 관련 props
  const imageProps = {
    imageUrls,
    onImageUrlsChange,
  };

  // 선택된 퀴즈 타입에 따라 적절한 필드 컴포넌트 렌더링
  const renderFields = () => {
    switch (questionType) {
      case 'trivia':
        return <TriviaFields {...commonProps} />;
      
      case 'movie':
        return <MovieFields {...commonProps} />;
      
      case 'photo-year':
        return <PhotoYearFields {...commonProps} {...imageProps} />;
      
      case 'guess-who':
        return <GuessWhoFields {...commonProps} {...imageProps} />;
      
      default:
        return <div className={styles.errorMessage}>유효하지 않은 퀴즈 타입입니다.</div>;
    }
  };

  return (
    <div className={styles.container}>
      {renderFields()}
    </div>
  );
};

export default QuizFormFields;