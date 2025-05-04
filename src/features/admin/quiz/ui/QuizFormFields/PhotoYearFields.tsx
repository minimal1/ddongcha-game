import React from 'react';
import CommonFields from './CommonFields';
import ImageUploader from '../ImageUploader';
import styles from './QuizFormFields.module.css';

interface PhotoYearFieldsProps {
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
 * 연도 퀴즈(Photo-year) 필드 컴포넌트
 * 
 * 연도 퀴즈에 필요한 필드들을 제공합니다.
 * - 이미지 업로드 기능 (사진)
 * - 공통 필드 (문제, 정답, 힌트)
 */
const PhotoYearFields: React.FC<PhotoYearFieldsProps> = ({
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
      onQuestionChange("사진이 촬영된 연도를 맞추세요.");
    } else {
      onQuestionChange(value);
    }
  };

  // 정답이 숫자인지 확인
  const handleAnswerChange = (value: string) => {
    // 숫자만 입력 가능하도록
    const numericValue = value.replace(/[^0-9]/g, '');
    onAnswerChange(numericValue);
  };

  return (
    <div className={styles.photoYearFields}>
      <div className={styles.fieldInfo}>
        <h3 className={styles.fieldTitle}>연도 퀴즈 정보</h3>
        <p className={styles.fieldDescription}>
          역사적인 사진이나 과거 장면을 보여주고 몇 년도에 촬영되었는지 맞추는 퀴즈입니다.
          사진을 업로드하고, 정답(연도)를 입력하세요. 문제는 기본값으로 제공되지만 수정할 수 있습니다.
        </p>
      </div>
      
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          사진
          <span className={styles.required}>*</span>
        </label>
        <ImageUploader
          questionType="photo-year"
          initialImages={imageUrls}
          onChange={onImageUrlsChange}
          maxImages={1}
          disabled={disabled}
        />
        {imageUrls.length === 0 && <p className={styles.errorMessage}>사진을 업로드해주세요.</p>}
      </div>
      
      <CommonFields
        question={question || "사진이 촬영된 연도를 맞추세요."}
        answer={answer}
        hints={hints}
        onQuestionChange={handleQuestionChange}
        onAnswerChange={handleAnswerChange}
        onHintsChange={onHintsChange}
        disabled={disabled}
      />
      
      {answer && !/^\d{4}$/.test(answer) && (
        <p className={styles.warningMessage}>
          정답은 4자리 연도(예: 1998)로 입력하는 것을 권장합니다.
        </p>
      )}
    </div>
  );
};

export default PhotoYearFields;