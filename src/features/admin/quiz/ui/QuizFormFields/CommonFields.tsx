import React from 'react';
import styles from './QuizFormFields.module.css';
import HintsField from '../HintsField';

interface CommonFieldsProps {
  question: string;
  answer: string;
  hints: string[];
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onHintsChange: (values: string[]) => void;
  disabled?: boolean;
}

/**
 * 퀴즈 공통 필드 컴포넌트
 * 
 * 모든 퀴즈 타입에서 공통으로 사용되는 필드들을 제공합니다.
 * - 문제(question)
 * - 정답(answer)
 * - 힌트(hints)
 */
const CommonFields: React.FC<CommonFieldsProps> = ({
  question,
  answer,
  hints,
  onQuestionChange,
  onAnswerChange,
  onHintsChange,
  disabled = false,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.fieldGroup}>
        <label htmlFor="question" className={styles.label}>
          문제
          <span className={styles.required}>*</span>
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="문제를 입력하세요"
          className={styles.textarea}
          rows={3}
          disabled={disabled}
          required
        />
        {!question && <p className={styles.errorMessage}>문제를 입력해주세요.</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="answer" className={styles.label}>
          정답
          <span className={styles.required}>*</span>
        </label>
        <input
          id="answer"
          type="text"
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="정답을 입력하세요"
          className={styles.input}
          disabled={disabled}
          required
        />
        {!answer && <p className={styles.errorMessage}>정답을 입력해주세요.</p>}
      </div>

      <HintsField
        hints={hints}
        onChange={onHintsChange}
        disabled={disabled}
      />
    </div>
  );
};

export default CommonFields;