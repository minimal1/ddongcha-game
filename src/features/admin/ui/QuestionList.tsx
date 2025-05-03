import React, { useState, useEffect } from 'react';
import { useGameSession } from '@/hooks/useGameSession';
import { GameQuestion } from '@/shared/config/types';
import QuestionEditor from './QuestionEditor';
import styles from './QuestionList.module.css';

/**
 * 문항 관리 컴포넌트
 */
const QuestionList: React.FC = () => {
  const { getGameQuestions, deleteGameQuestion } = useGameSession();
  
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  
  // 문항 데이터 로딩
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const questionsData = await getGameQuestions();
        setQuestions(questionsData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load questions'));
        console.error('Questions loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [getGameQuestions]);
  
  // 문항 생성/수정 모달 열기
  const handleOpenEditor = (question?: GameQuestion) => {
    setCurrentQuestion(question || null);
    setIsEditorOpen(true);
  };
  
  // 문항 에디터 닫기
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setCurrentQuestion(null);
  };
  
  // 문항 저장 후 처리
  const handleQuestionSaved = (savedQuestion: GameQuestion) => {
    setIsEditorOpen(false);
    
    // 목록 업데이트
    setQuestions(prevQuestions => {
      // 기존 문항 수정인 경우
      if (currentQuestion) {
        return prevQuestions.map(q => 
          q.id === savedQuestion.id ? savedQuestion : q
        );
      }
      // 새 문항 추가인 경우
      return [savedQuestion, ...prevQuestions];
    });
    
    setCurrentQuestion(null);
  };
  
  // 문항 삭제 처리
  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('정말로 이 문항을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      const success = await deleteGameQuestion(questionId);
      
      if (success) {
        // 목록에서 제거
        setQuestions(prevQuestions => 
          prevQuestions.filter(q => q.id !== questionId)
        );
      } else {
        throw new Error('Failed to delete question');
      }
    } catch (err) {
      alert('문항 삭제 중 오류가 발생했습니다.');
      console.error('Question deletion error:', err);
    }
  };
  
  // 문항 유형 표시 텍스트
  const getQuestionTypeText = (type: string) => {
    switch (type) {
      case 'single':
        return '단일 선택';
      case 'multiple':
        return '객관식';
      case 'text':
        return '주관식';
      default:
        return '알 수 없음';
    }
  };
  
  // 로딩 상태 표시
  if (loading) {
    return (
      <div className={styles.loading}>
        <p>문항 데이터를 불러오는 중...</p>
      </div>
    );
  }
  
  // 오류 상태 표시
  if (error) {
    return (
      <div className={styles.error}>
        <p>데이터 로딩 중 오류가 발생했습니다: {error.message}</p>
      </div>
    );
  }
  
  // 문항이 없는 경우
  if (questions.length === 0) {
    return (
      <div className={styles.empty}>
        <h2 className={styles.title}>문항 관리</h2>
        <p>아직 등록된 문항이 없습니다.</p>
        <button 
          className={styles.createButton}
          onClick={() => handleOpenEditor()}
        >
          새 문항 추가
        </button>
        
        {isEditorOpen && (
          <QuestionEditor
            question={currentQuestion}
            onClose={handleCloseEditor}
            onSave={handleQuestionSaved}
          />
        )}
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>문항 관리</h2>
        <button 
          className={styles.createButton}
          onClick={() => handleOpenEditor()}
        >
          새 문항 추가
        </button>
      </div>
      
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="문항 검색..."
          className={styles.searchInput}
        />
        
        <select className={styles.filterSelect}>
          <option value="">모든 유형</option>
          <option value="single">단일 선택</option>
          <option value="multiple">객관식</option>
          <option value="text">주관식</option>
        </select>
      </div>
      
      <div className={styles.questionList}>
        {questions.map((question) => (
          <div key={question.id} className={styles.questionItem}>
            <div className={styles.questionHeader}>
              <div className={styles.questionTitle}>
                <h3>{question.title}</h3>
                <span className={styles.questionType}>
                  {getQuestionTypeText(question.type)}
                </span>
              </div>
              
              <div className={styles.questionActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleOpenEditor(question)}
                >
                  수정
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  삭제
                </button>
              </div>
            </div>
            
            <div className={styles.questionContent}>
              <p>{question.content}</p>
              
              {question.type === 'multiple' && question.options && (
                <div className={styles.questionOptions}>
                  <h4>선택지:</h4>
                  <ul>
                    {question.options.map((option) => (
                      <li key={option.id} className={option.isCorrect ? styles.correctOption : ''}>
                        {option.text} {option.isCorrect && <span>(정답)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(question.type === 'single' || question.type === 'text') && question.answer && (
                <div className={styles.questionAnswer}>
                  <h4>정답:</h4>
                  <p>{question.answer}</p>
                </div>
              )}
            </div>
            
            <div className={styles.questionMeta}>
              <span>난이도: {question.difficulty || '보통'}</span>
              <span>점수: {question.points || 1}점</span>
              <span>시간 제한: {question.timeLimit || 30}초</span>
            </div>
          </div>
        ))}
      </div>
      
      {isEditorOpen && (
        <QuestionEditor
          question={currentQuestion}
          onClose={handleCloseEditor}
          onSave={handleQuestionSaved}
        />
      )}
    </div>
  );
};

export default QuestionList;
