import React from 'react';
import CommonFields from './CommonFields';
import styles from './QuizFormFields.module.css';

interface MovieFieldsProps {
  question: string;
  answer: string;
  hints: string[];
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onHintsChange: (values: string[]) => void;
  disabled?: boolean;
}

/**
 * 영화 퀴즈(Movie) 필드 컴포넌트
 * 
 * 영화 퀴즈에 필요한 필드들을 제공합니다.
 * - 영화 퀴즈는 기본 필드만 사용합니다.
 * - 영화 명대사나 장면 설명을 문제로, 영화 제목을 정답으로 사용합니다.
 */
const MovieFields: React.FC<MovieFieldsProps> = (props) => {
  return (
    <div className={styles.movieFields}>
      <div className={styles.fieldInfo}>
        <h3 className={styles.fieldTitle}>영화 퀴즈 정보</h3>
        <p className={styles.fieldDescription}>
          영화의 명대사나 장면 설명을 문제로, 해당 영화의 제목을 정답으로 하는 퀴즈를 만들 수 있습니다.
          문제와 정답을 입력하고, 필요하다면 힌트를 추가하세요.
        </p>
        <div className={styles.example}>
          <p className={styles.exampleTitle}>예시:</p>
          <p className={styles.exampleQuestion}>문제: 내 이름은 포레스트, 포레스트 검프입니다.</p>
          <p className={styles.exampleAnswer}>정답: 포레스트 검프</p>
        </div>
      </div>
      
      <CommonFields {...props} />
    </div>
  );
};

export default MovieFields;