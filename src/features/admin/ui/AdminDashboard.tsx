import React, { useState, useEffect } from 'react';
import { useSupabaseContext } from '@/shared/context/SupabaseProvider';
import { useGameSession } from '@/hooks/useGameSession';
import styles from './AdminDashboard.module.css';

/**
 * 관리자 대시보드 컴포넌트
 */
const AdminDashboard: React.FC = () => {
  const { user } = useSupabaseContext();
  const { getGameQuestions, getGameSessionsByHost } = useGameSession();
  
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalSessions: 0,
    activeSessions: 0,
    totalPlayers: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 대시보드 데이터 로딩
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 문제 데이터 로딩
        const questions = await getGameQuestions();
        
        // 세션 데이터 로딩 (임시로 유저 ID 사용, 실제로는 인증된 사용자 ID 사용)
        const hostId = user?.id || 'anonymous';
        const sessions = await getGameSessionsByHost(hostId);
        
        // 활성 세션 계산 (state가 'ended'가 아닌 세션)
        const activeSessions = sessions.filter(s => s.state !== 'ended');
        
        // 총 플레이어 수 계산 (실제 구현 시 별도 쿼리 필요)
        const totalPlayers = 0; // 임시값, 실제로는 DB 쿼리로 계산
        
        setStats({
          totalQuestions: questions.length,
          totalSessions: sessions.length,
          activeSessions: activeSessions.length,
          totalPlayers
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load dashboard data'));
        console.error('Dashboard loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [getGameQuestions, getGameSessionsByHost, user]);
  
  // 로딩 상태 표시
  if (loading) {
    return (
      <div className={styles.loading}>
        <p>대시보드 데이터를 불러오는 중...</p>
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
  
  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>관리자 대시보드</h2>
      
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>총 문항 수</h3>
          <p className={styles.statValue}>{stats.totalQuestions}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>게임 세션 수</h3>
          <p className={styles.statValue}>{stats.totalSessions}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>활성 세션 수</h3>
          <p className={styles.statValue}>{stats.activeSessions}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>총 플레이어 수</h3>
          <p className={styles.statValue}>{stats.totalPlayers}</p>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button className={styles.actionButton}>새 문항 추가</button>
        <button className={styles.actionButton}>새 게임 세션 생성</button>
      </div>
      
      <div className={styles.recentActivity}>
        <h3>최근 활동</h3>
        <p>최근 활동 내역은 아직 구현되지 않았습니다.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
