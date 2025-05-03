import React, { useState, useEffect } from 'react';
import { useSupabaseContext } from '@/shared/context/SupabaseProvider';
import { useGameSession } from '@/hooks/useGameSession';
import { GameSession } from '@/shared/config/types';
import Link from 'next/link';
import styles from './GameSessionList.module.css';

/**
 * 게임 세션 목록 컴포넌트
 */
const GameSessionList: React.FC = () => {
  const { user } = useSupabaseContext();
  const { getGameSessionsByHost } = useGameSession();
  
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 세션 데이터 로딩
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 호스트 ID로 세션 목록 로딩 (임시로 유저 ID 사용, 실제로는 인증된 사용자 ID 사용)
        const hostId = user?.id || 'anonymous';
        const sessionsData = await getGameSessionsByHost(hostId);
        
        setSessions(sessionsData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load game sessions'));
        console.error('Session loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSessions();
  }, [getGameSessionsByHost, user]);
  
  // 로딩 상태 표시
  if (loading) {
    return (
      <div className={styles.loading}>
        <p>게임 세션 데이터를 불러오는 중...</p>
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
  
  // 세션이 없는 경우
  if (sessions.length === 0) {
    return (
      <div className={styles.empty}>
        <h2 className={styles.title}>게임 세션 관리</h2>
        <p>아직 생성된 게임 세션이 없습니다.</p>
        <button className={styles.createButton}>
          새 게임 세션 생성
        </button>
      </div>
    );
  }
  
  // 세션 상태에 따른 배지 색상
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'waiting':
        return styles.statusWaiting;
      case 'question':
        return styles.statusActive;
      case 'result':
        return styles.statusActive;
      case 'ended':
        return styles.statusEnded;
      default:
        return '';
    }
  };
  
  // 세션 상태 표시 텍스트
  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return '대기 중';
      case 'question':
        return '진행 중';
      case 'result':
        return '결과 표시 중';
      case 'ended':
        return '종료됨';
      default:
        return '알 수 없음';
    }
  };
  
  // 세션 시작 시간 포맷
  const formatDate = (dateString?: string) => {
    if (!dateString) return '시작 전';
    
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>게임 세션 관리</h2>
        <button className={styles.createButton}>
          새 게임 세션 생성
        </button>
      </div>
      
      <div className={styles.sessionList}>
        <div className={styles.sessionListHeader}>
          <div>이름</div>
          <div>상태</div>
          <div>시작 시간</div>
          <div>문항 수</div>
          <div>액션</div>
        </div>
        
        {sessions.map((session) => (
          <div key={session.id} className={styles.sessionItem}>
            <div className={styles.sessionName}>{session.name}</div>
            
            <div>
              <span className={`${styles.statusBadge} ${getStatusBadgeClass(session.state)}`}>
                {getStatusText(session.state)}
              </span>
            </div>
            
            <div className={styles.sessionDate}>
              {formatDate(session.startedAt)}
            </div>
            
            <div className={styles.sessionQuestions}>
              {session.questions.length}개
            </div>
            
            <div className={styles.sessionActions}>
              <Link href={`/host/${session.id}`} className={styles.hostLink}>
                진행 화면
              </Link>
              <button className={styles.detailsButton}>상세 정보</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSessionList;
