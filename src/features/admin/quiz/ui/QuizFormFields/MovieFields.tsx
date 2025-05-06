import React from 'react';
import CommonFields from './CommonFields';
import styles from './QuizFormFields.module.css';
import ImageUploader from '../ImageUploader';

interface MovieFieldsProps {
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
 * 영화 퀴즈(Movie) 필드 컴포넌트
 * 
 * 영화 퀴즈에 필요한 필드들을 제공합니다.
 * - 영화 제목을 문제로 명대사를 정답으로 사용합니다.
 * - 이미지 업로드 기능 (사진)
 * - 공통 필드 (문제, 정답, 힌트)
 */
const MovieFields: React.FC<MovieFieldsProps> = (
  {
    imageUrls, onImageUrlsChange, ...props
  }
  
) => {
  return (
    <div className={styles.movieFields}>
      <div className={styles.fieldInfo}>
        <h3 className={styles.fieldTitle}>영화 퀴즈 정보</h3>
        <p className={styles.fieldDescription}>
          영화 제목을 문제로 하고, 해당 영화의 명대사를 정답으로 하는 퀴즈입니다.
          상황에 해당하는 이미지를 업로드하고, 정답(명대사)을 입력하세요.
        </p>
        <div className={styles.example}>
          <p className={styles.exampleTitle}>예시:</p>
          <p className={styles.exampleAnswer}>문제: 포레스트 검프</p>
          <p className={styles.exampleQuestion}>정답: 내 이름은 포레스트, 포레스트 검프입니다.</p>
        </div>
      </div>
      
         
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          사진
          <span className={styles.required}>*</span>
        </label>
        <ImageUploader
          questionType="movie"
          initialImages={imageUrls}
          onChange={onImageUrlsChange}
          maxImages={1}
          disabled={props.disabled}
        />
        {imageUrls.length === 0 && <p className={styles.errorMessage}>사진을 업로드해주세요.</p>}
      </div>
      
      
      <CommonFields {...props} />
    </div>
  );
};

export default MovieFields;