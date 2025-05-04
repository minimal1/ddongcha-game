import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseContext } from '@/shared/supabase/lib/SupabaseProvider';
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
  
  
  useEffect(() => {
    const checkAuth = async () => {
      // 로그인 체크 - 로그인되어있지 않은 경우
      if (!sessionLoading && !session) {
        router.push('/login?redirect=' + encodeURIComponent(router.asPath));
        return;
      }
    };
    
    checkAuth();
  }, [user, session, sessionLoading, router]);
  
  // 로딩 체크 또는 관리자 권한 체크 중인 경우
  if (sessionLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>인증 확인 중...</p>
      </div>
    );
  }
  
  // 관리자인 경우 - 원본 컴포넌트 렌더링
  return <>{children}</>;
};

export default AdminAuthGuard;