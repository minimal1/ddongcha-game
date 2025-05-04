import React from 'react';
import CommonFields from './CommonFields';
import styles from './QuizFormFields.module.css';

interface TriviaFieldsProps {
  question: string;
  answer: string;
  hints: string[];
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onHintsChange: (values: string[]) => void;
  disabled?: boolean;
}

/**
 * 일반 퀴즈(Trivia) 필드 컴포넌트
 * 
 * 일반 퀴즈에 필요한 필드들을 제공합니다.
 * - 일반 퀴즈는 기본 필드만 사용합니다.
 */
const TriviaFields: React.FC<TriviaFieldsProps> = (props) => {
  return (
    <div className={styles.triviaFields}>
      <div className={styles.fieldInfo}>
        <h3 className={styles.fieldTitle}>일반 퀴즈 정보</h3>
        <p className={styles.fieldDescription}>
          일반적인 지식이나, 상식, 역사 등에 관한 퀴즈를 만들 수 있습니다.
          퀴즈 문제와 정답을 입력하고, 필요하다면 힌트를 추가하세요.
        </p>
      </div>
      
      <CommonFields {...props} />
    </div>
  );
};

export default TriviaFields;