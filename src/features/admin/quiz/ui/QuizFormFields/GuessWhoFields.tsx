import React from 'react';
import CommonFields from './CommonFields';
import ImageUploader from '../ImageUploader';
import styles from './QuizFormFields.module.css';

interface GuessWhoFieldsProps {
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

const IMAGE_COUNT = 4; // 업로드할 이미지 수
/**
 * 인물 맞추기 퀴즈(Guess-who) 필드 컴포넌트
 * 
 * 인물 맞추기 퀴즈에 필요한 필드들을 제공합니다.
 * - 이미지 업로드 기능 (n장의 인물 사진)
 * - 공통 필드 (문제, 정답, 힌트)
 */
const GuessWhoFields: React.FC<GuessWhoFieldsProps> = ({
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
  const handleQuestionChange = (value: string) => {
    if (!value.trim()) {
      // 빈 값이면 기본 문제 설정
      onQuestionChange("이 사람이 누구인지 맞추세요.");
    } else {
      onQuestionChange(value);
    }
  };

  return (
    <div className={styles.guessWhoFields}>
      <div className={styles.fieldInfo}>
        <h3 className={styles.fieldTitle}>인물 맞추기 퀴즈 정보</h3>
        <p className={styles.fieldDescription}>
          인물을 부분적으로 가리거나 다양한 각도에서 촬영한 3장의 사진을 통해 해당 인물이 누구인지 맞추는 퀴즈입니다.
          3장의 사진을 업로드하고, 정답(인물 이름)을 입력하세요. 문제는 기본값으로 제공되지만 수정할 수 있습니다.
        </p>
      </div>
      
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          인물 사진
          <span className={styles.required}>*</span>
          <span className={styles.helpText}>({IMAGE_COUNT}장)</span>
        </label>
        <ImageUploader
          questionType="guess-who"
          initialImages={imageUrls}
          onChange={onImageUrlsChange}
          maxImages={IMAGE_COUNT}
          disabled={disabled}
        />
        {imageUrls.length === 0 && <p className={styles.errorMessage}>사진을 업로드해주세요.</p>}
        {imageUrls.length > 0 && imageUrls.length < IMAGE_COUNT && (
          <p className={styles.warningMessage}>인물 사진은 {IMAGE_COUNT}장을 업로드하는 것을 권장합니다.</p>
        )}
      </div>
      
      <CommonFields
        question={question || "이 사람이 누구인지 맞추세요."}
        answer={answer}
        hints={hints}
        onQuestionChange={handleQuestionChange}
        onAnswerChange={onAnswerChange}
        onHintsChange={onHintsChange}
        disabled={disabled}
      />
    </div>
  );
};

export default GuessWhoFields;