import React, { useState, useEffect } from 'react';
import { useGameSession } from '@/hooks/useGameSession';
import { GameQuestion } from '@/shared/config/types';
import FileUploader from './FileUploader';
import styles from './QuestionEditor.module.css';

interface QuestionEditorProps {
  question: GameQuestion | null;
  onClose: () => void;
  onSave: (question: GameQuestion) => void;
}

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/**
 * 문항 편집 컴포넌트
 */
const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onClose,
  onSave
}) => {
  const { createGameQuestion, updateGameQuestion } = useGameSession();
  
  // 폼 상태 초기화
  const [title, setTitle] = useState(question?.title || '');
  const [content, setContent] = useState(question?.content || '');
  const [type, setType] = useState(question?.type || 'text');
  const [answer, setAnswer] = useState(question?.answer || '');
  const [options, setOptions] = useState<QuestionOption[]>(
    question?.options || [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false },
      { id: '3', text: '', isCorrect: false },
      { id: '4', text: '', isCorrect: false }
    ]
  );
  const [timeLimit, setTimeLimit] = useState(question?.timeLimit || 30);
  const [points, setPoints] = useState(question?.points || 1);
  const [difficulty, setDifficulty] = useState(question?.difficulty || 'medium');
  const [imageUrl, setImageUrl] = useState(question?.imageUrl || '');
  const [hint, setHint] = useState(question?.hint || '');
  const [explanation, setExplanation] = useState(question?.explanation || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 문항 저장 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // 입력 검증
      if (!title.trim()) {
        throw new Error('문항 제목을 입력해주세요.');
      }
      
      if (!content.trim()) {
        throw new Error('문항 내용을 입력해주세요.');
      }
      
      if (type === 'multiple') {
        // 객관식 옵션 검증
        const filledOptions = options.filter(opt => opt.text.trim());
        if (filledOptions.length < 2) {
          throw new Error('최소 2개 이상의 선택지를 입력해주세요.');
        }
        
        if (!filledOptions.some(opt => opt.isCorrect)) {
          throw new Error('최소 하나의 정답을 선택해주세요.');
        }
      } else if (type === 'single' || type === 'text') {
        // 주관식/단일 선택 정답 검증
        if (!answer.trim()) {
          throw new Error('정답을 입력해주세요.');
        }
      }
      
      // 문항 데이터 구성
      const questionData: Omit<GameQuestion, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        content,
        type,
        answer: type !== 'multiple' ? answer : '',
        options: type === 'multiple' ? options.filter(opt => opt.text.trim()) : undefined,
        timeLimit,
        points,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        imageUrl: imageUrl || undefined,
        hint: hint || undefined,
        explanation: explanation || undefined
      };
      
      let savedQuestion: GameQuestion | null;
      
      // 새 문항 생성 또는 기존 문항 수정
      if (question) {
        // 수정
        savedQuestion = await updateGameQuestion(question.id, questionData);
      } else {
        // 생성
        savedQuestion = await createGameQuestion(questionData);
      }
      
      if (!savedQuestion) {
        throw new Error('문항 저장에 실패했습니다.');
      }
      
      // 부모 컴포넌트에 알림
      onSave(savedQuestion);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Question save error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 객관식 옵션 업데이트
  const handleOptionChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    setOptions(prevOptions => {
      const newOptions = [...prevOptions];
      newOptions[index] = {
        ...newOptions[index],
        [field]: value
      };
      return newOptions;
    });
  };
  
  // 객관식 옵션 추가
  const handleAddOption = () => {
    setOptions(prevOptions => [
      ...prevOptions,
      { id: `${prevOptions.length + 1}`, text: '', isCorrect: false }
    ]);
  };
  
  // 객관식 옵션 삭제
  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      return; // 최소 2개의 옵션 유지
    }
    
    setOptions(prevOptions => prevOptions.filter((_, i) => i !== index));
  };
  
  // 이미지 업로드 완료 처리
  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };
  
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{question ? '문항 수정' : '새 문항 추가'}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            닫기
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <p>{error.message}</p>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="title">문항 제목</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문항 제목을 입력하세요"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="content">문항 내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문항 내용을 입력하세요"
              rows={3}
              required
            ></textarea>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="type">문항 유형</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="text">주관식</option>
                <option value="single">단일 선택</option>
                <option value="multiple">객관식</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="difficulty">난이도</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">쉬움</option>
                <option value="medium">보통</option>
                <option value="hard">어려움</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="points">점수</label>
              <input
                id="points"
                type="number"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="timeLimit">제한 시간(초)</label>
              <input
                id="timeLimit"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                min="5"
                max="300"
              />
            </div>
          </div>
          
          {/* 객관식 옵션 */}
          {type === 'multiple' && (
            <div className={styles.optionsSection}>
              <h3>선택지</h3>
              
              <div className={styles.optionsList}>
                {options.map((option, index) => (
                  <div key={option.id} className={styles.optionItem}>
                    <input
                      type="checkbox"
                      id={`option-correct-${index}`}
                      checked={option.isCorrect}
                      onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                      placeholder={`선택지 ${index + 1}`}
                    />
                    <button
                      type="button"
                      className={styles.removeOptionButton}
                      onClick={() => handleRemoveOption(index)}
                      disabled={options.length <= 2}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                className={styles.addOptionButton}
                onClick={handleAddOption}
              >
                선택지 추가
              </button>
            </div>
          )}
          
          {/* 주관식/단일 선택 정답 */}
          {(type === 'text' || type === 'single') && (
            <div className={styles.formGroup}>
              <label htmlFor="answer">정답</label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="정답을 입력하세요"
                required
              />
            </div>
          )}
          
          {/* 이미지 업로드 */}
          <div className={styles.formGroup}>
            <label>문항 이미지 (선택사항)</label>
            <FileUploader
              onFileUploaded={handleImageUploaded}
              currentUrl={imageUrl}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="hint">힌트 (선택사항)</label>
            <input
              id="hint"
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="힌트를 입력하세요"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="explanation">설명 (선택사항)</label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="정답에 대한 설명을 입력하세요"
              rows={2}
            ></textarea>
          </div>
          
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? '저장 중...' : (question ? '수정' : '추가')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionEditor;
