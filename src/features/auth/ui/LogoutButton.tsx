import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/useAuth';
import styles from './LogoutButton.module.css';

/**
 * 로그아웃 버튼 컴포넌트
 */
const LogoutButton: React.FC = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        alert('로그아웃 중 오류가 발생했습니다.');
        return;
      }
      
      // 로그아웃 성공 시 메인 페이지로 이동
      router.push('/');
    } catch (err) {
      console.error('Unexpected logout error:', err);
      alert('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      className={styles.logoutButton}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
    </button>
  );
};

export default LogoutButton;