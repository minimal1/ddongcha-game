import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './Login.module.css';
import Link from 'next/link';
import useAuth from '@/features/admin/auth/lib/useAuth';

/**
 * 로그인 페이지 컴포넌트
 */
const LoginPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading, signInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { redirect } = router.query;

  // 이미 로그인한 경우 리디렉션
  useEffect(() => {
    if (user) {
      // 리디렉션 파라미터가 있으면 해당 페이지로, 없으면 관리자 페이지로
      router.push((redirect as string) || '/admin');
    }
  }, [user, router, redirect]);

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoggingIn(true);
      const { error } = await signInWithPassword(
        email,
        password,
      );

      if (error) {
        throw error;
      }
      
      // 로그인 성공 시 signInWithPassword 함수에서 리디렉션이 처리됨
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 로딩 중이면 로딩 화면
  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>로그인 - 똥차 퀴즈 관리자</title>
        <meta name="description" content="똥차 퀴즈 관리자 로그인 페이지" />
      </Head>

      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>관리자 로그인</h1>
          <p className={styles.subtitle}>퀴즈 관리를 위해 로그인하세요</p>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isLoggingIn}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoggingIn}
                className={styles.input}
              />
            </div>

            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className={styles.returnLink}>
            <Link href="/"> 
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;