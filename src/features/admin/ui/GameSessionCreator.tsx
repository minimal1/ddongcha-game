import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseContext } from '@/shared/context/SupabaseProvider';
import { useGameSession } from '@/hooks/useGameSession';
import { GameQuestion, GameSession } from '@/shared/config/types';
import styles from './GameSessionCreator.module.css';

interface GameSessionCreatorProps {
  onClose: () => void;
  onSessionCreated?: (session: GameSession) => void;
}

/**
 * 게임 세션 생성 컴포넌트
 */
const GameSessionCreator: React.FC<GameSessionCreatorProps> = ({
  onClose,
  onSessionCreated
}) => {
  const router = useRouter();
  const { user } = useSupabaseContext();
  const { getGameQuestions, createGameSession } = useGameSession();
  
  const [name, setName] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<GameQuestion[]>([]);
  const [settings, setSettings] = useState({
    allowLateJoin: true,
    questionTimer: 30,
    randomizeQuestions: false,
    showResultsAfterEach: true,
    countdownBeforeQuestion: 3
  });
  
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 문항 데이터 로딩
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const questionsData = await getGameQuestions();
        setAvailableQuestions(questionsData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load questions'));
        console.error('Questions loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [getGameQuestions]);
  
  // 모든 문항 선택/해제
  const toggleAllQuestions = (selected: boolean) => {
    if (selected) {
      setSelectedQuestionIds(availableQuestions.map(q => q.id));
    } else {
      setSelectedQuestionIds([]);
    }
  };
  
  // 단일 문항 선택/해제
  const toggleQuestion = (questionId: string) => {
    setSelectedQuestionIds(prev => {
      const isSelected = prev.includes(questionId);
      
      if (isSelected) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };
  
  // 설정 변경 처리
  const handleSettingChange = (
    key: keyof typeof settings,
    value: typeof settings[keyof typeof settings]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 세션 생성 처리
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError(new Error('로그인이 필요합니다'));
      return;
    }
    
    try {
      setCreating(true);
      setError(null);
      
      // 입력 검증
      if (!name.trim()) {
        throw new Error('세션 이름을 입력해주세요.');
      }
      
      if (selectedQuestionIds.length === 0) {
        throw new Error('최소 하나 이상의 문항을 선택해주세요.');
      }
      
      // 게임 세션 생성
      const session = await createGameSession(
        name,
        selectedQuestionIds,
        user.id,
        settings
      );
      
      if (!session) {
        throw new Error('세션 생성에 실패했습니다.');
      }
      
      // 생성 성공 처리
      if (onSessionCreated) {
        onSessionCreated(session);
      }
      
      // 세션 진행 페이지로 이동할지 확인
      const shouldNavigate = window.confirm('게임 세션이 생성되었습니다. 진행 화면으로 이동하시겠습니까?');
      
      if (shouldNavigate) {
        router.push(`/host/${session.id}`);
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('세션 생성 중 오류가 발생했습니다.'));
      console.error('Session creation error:', err);
    } finally {
      setCreating(false);
    }
  };
  
  // 로딩 상태 표시
  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.loading}>
            <p>문항 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 사용 가능한 문항이 없는 경우
  if (availableQuestions.length === 0) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>새 게임 세션 생성</h2>
            <button 
              className={styles.closeButton}
              onClick={onClose}
              type="button"
            >
              닫기
            </button>
          </div>
          
          <div className={styles.noQuestions}>
            <p>사용 가능한 문항이 없습니다. 먼저 문항을 추가해주세요.</p>
            <button 
              className={styles.cancelButton}
              onClick={onClose}
              type="button"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>새 게임 세션 생성</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            닫기
          </button>
        </div>
        
        <form onSubmit={handleCreateSession} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <p>{error.message}</p>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="name">세션 이름</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="게임 세션 이름을 입력하세요"
              required
            />
          </div>
          
          <div className={styles.formSection}>
            <h3>게임 설정</h3>
            <div className={styles.settingsGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="questionTimer">문항당 시간 (초)</label>
                <input
                  id="questionTimer"
                  type="number"
                  value={settings.questionTimer}
                  onChange={(e) => handleSettingChange('questionTimer', parseInt(e.target.value))}
                  min="5"
                  max="300"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="countdownBeforeQuestion">카운트다운 시간 (초)</label>
                <input
                  id="countdownBeforeQuestion"
                  type="number"
                  value={settings.countdownBeforeQuestion}
                  onChange={(e) => handleSettingChange('countdownBeforeQuestion', parseInt(e.target.value))}
                  min="0"
                  max="10"
                />
              </div>
              
              <div className={styles.formCheckbox}>
                <input
                  id="allowLateJoin"
                  type="checkbox"
                  checked={settings.allowLateJoin}
                  onChange={(e) => handleSettingChange('allowLateJoin', e.target.checked)}
                />
                <label htmlFor="allowLateJoin">늦은 참가 허용</label>
              </div>
              
              <div className={styles.formCheckbox}>
                <input
                  id="randomizeQuestions"
                  type="checkbox"
                  checked={settings.randomizeQuestions}
                  onChange={(e) => handleSettingChange('randomizeQuestions', e.target.checked)}
                />
                <label htmlFor="randomizeQuestions">문항 순서 섞기</label>
              </div>
              
              <div className={styles.formCheckbox}>
                <input
                  id="showResultsAfterEach"
                  type="checkbox"
                  checked={settings.showResultsAfterEach}
                  onChange={(e) => handleSettingChange('showResultsAfterEach', e.target.checked)}
                />
                <label htmlFor="showResultsAfterEach">각 문항 후 결과 표시</label>
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <div className={styles.questionSelectHeader}>
              <h3>문항 선택 ({selectedQuestionIds.length}/{availableQuestions.length})</h3>
              <div className={styles.selectAllContainer}>
                <input
                  id="selectAll"
                  type="checkbox"
                  checked={selectedQuestionIds.length === availableQuestions.length}
                  onChange={(e) => toggleAllQuestions(e.target.checked)}
                />
                <label htmlFor="selectAll">모두 선택</label>
              </div>
            </div>
            
            <div className={styles.questionList}>
              {availableQuestions.map((question) => (
                <div key={question.id} className={styles.questionItem}>
                  <input
                    id={`question-${question.id}`}
                    type="checkbox"
                    checked={selectedQuestionIds.includes(question.id)}
                    onChange={() => toggleQuestion(question.id)}
                  />
                  <label htmlFor={`question-${question.id}`}>
                    <span className={styles.questionTitle}>{question.title}</span>
                    <span className={styles.questionType}>
                      {question.type === 'text' ? '주관식' : 
                       question.type === 'single' ? '단일 선택' : '객관식'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={creating}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.createButton}
              disabled={creating || selectedQuestionIds.length === 0}
            >
              {creating ? '생성 중...' : '게임 세션 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameSessionCreator;
