import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseContext } from '@/shared/context/SupabaseProvider';
import { useAuth } from '../lib/useAuth';
import styles from './AdminAuthGuard.module.css';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

/**
 * 관리자 권한 확인 컴포넌트
 * 인증되지 않은 사용자가 관리자 페이지에 접근하지 못하도록 함
 */
const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user, session, loading: sessionLoading } = useSupabaseContext();
  const { checkAdminStatus } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      // 로그인 체크 - 로그인되어있지 않은 경우
      if (!sessionLoading && !session) {
        router.push('/login?redirect=' + encodeURIComponent(router.asPath));
        return;
      }
      
      // 로그인 체크 - 로그인된 경우
      if (!sessionLoading && user) {
        try {
          // 관리자 권한 확인
          const { isAdmin: adminStatus, error } = await checkAdminStatus();
          
          if (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          } else {
            setIsAdmin(adminStatus);
          }
        } catch (error) {
          console.error('Admin status check failed:', error);
          setIsAdmin(false);
        } finally {
          setIsCheckingAdmin(false);
        }
      }
    };
    
    checkAuth();
  }, [user, session, sessionLoading, router, checkAdminStatus]);
  
  // 로딩 체크 또는 관리자 권한 체크 중인 경우
  if (sessionLoading || isCheckingAdmin) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>인증 확인 중...</p>
      </div>
    );
  }
  
  // 관리자가 아닌 경우
  if (!isAdmin) {
    return (
      <div className={styles.unauthorized}>
        <h2>접근 제한</h2>
        <p>이 페이지에 접근할 권한이 없습니다.</p>
        <button 
          className={styles.goBackButton}
          onClick={() => router.push('/')}
        >
          메인 페이지로 돌아가기
        </button>
      </div>
    );
  }
  
  // 관리자인 경우 - 원본 컴포넌트 렌더링
  return <>{children}</>;
};

export default AdminAuthGuard;