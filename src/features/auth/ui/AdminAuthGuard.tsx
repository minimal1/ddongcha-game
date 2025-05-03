import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseContext } from '@/shared/context/SupabaseProvider';
import styles from './AdminAuthGuard.module.css';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

/**
 * 관리자 인증 보호 컴포넌트
 * 인증되지 않은 사용자가 관리자 페이지에 접근하지 못하도록 함
 */
const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user, session, loading } = useSupabaseContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      // 로딩 중이 아니고 로그인되지 않은 경우
      if (!loading && !session) {
        router.push('/login?redirect=' + encodeURIComponent(router.asPath));
        return;
      }
      
      // 로딩 중이 아니고 로그인된 경우
      if (!loading && user) {
        try {
          // 실제 애플리케이션에서는 사용자의 관리자 권한을 확인하는 로직을 구현해야 함
          // 예: Supabase RLS 정책 또는 데이터베이스 쿼리를 통해 확인
          
          // 현재는 모든 인증된 사용자를 관리자로 취급 (데모용)
          setIsAdmin(true);
        } catch (error) {
          console.error('Admin status check failed:', error);
          setIsAdmin(false);
        } finally {
          setIsCheckingAdmin(false);
        }
      }
    };
    
    checkAdminStatus();
  }, [user, session, loading, router]);
  
  // 로딩 중이거나 관리자 체크 중인 경우
  if (loading || isCheckingAdmin) {
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
  
  // 관리자인 경우 - 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default AdminAuthGuard;
