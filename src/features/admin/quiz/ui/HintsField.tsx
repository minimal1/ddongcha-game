import React from 'react';
import styles from './HintsField.module.css';

interface HintsFieldProps {
  hints: string[];
  onChange: (hints: string[]) => void;
  disabled?: boolean;
}

/**
 * 힌트 입력 필드 컴포넌트
 * 
 * 퀴즈 생성/수정 시 여러 개의 힌트를 추가/삭제할 수 있는 UI를 제공합니다.
 */
const HintsField: React.FC<HintsFieldProps> = ({
  hints,
  onChange,
  disabled = false,
}) => {
  // 힌트 추가
  const handleAddHint = () => {
    onChange([...hints, '']);
  };

  // 힌트 삭제
  const handleRemoveHint = (index: number) => {
    const newHints = [...hints];
    newHints.splice(index, 1);
    onChange(newHints);
  };

  // 힌트 변경
  const handleChangeHint = (index: number, value: string) => {
    const newHints = [...hints];
    newHints[index] = value;
    onChange(newHints);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <label className={styles.label}>힌트 (선택사항)</label>
        <button
          type="button"
          onClick={handleAddHint}
          className={styles.addButton}
          disabled={disabled}
        >
          + 힌트 추가
        </button>
      </div>

      {hints.length === 0 ? (
        <p className={styles.emptyMessage}>추가된 힌트가 없습니다. 힌트를 추가하려면 힌트 추가 버튼을 클릭하세요.</p>
      ) : (
        <ul className={styles.hintsList}>
          {hints.map((hint, index) => (
            <li key={index} className={styles.hintItem}>
              <div className={styles.hintNumber}>{index + 1}</div>
              <input
                type="text"
                value={hint}
                onChange={(e) => handleChangeHint(index, e.target.value)}
                placeholder={`힌트 ${index + 1}`}
                className={styles.hintInput}
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => handleRemoveHint(index)}
                className={styles.removeButton}
                disabled={disabled}
                aria-label="힌트 삭제"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HintsField;