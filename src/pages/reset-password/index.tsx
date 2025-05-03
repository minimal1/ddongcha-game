import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseContext } from '@/shared/context/SupabaseProvider';
import styles from './ResetPassword.module.css';

/**
 * 비밀번호 재설정 페이지
 * Supabase에서 제공한 링크를 통해 접근하여 새 비밀번호 설정
 */
const PasswordResetPage: React.FC = () => {
  const router = useRouter();
  const { supabase } = useSupabaseContext();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // URL에서 토큰 파라미터 확인
  useEffect(() => {
    const { access_token, type } = router.query;
    
    // 토큰이나 타입이 없거나 유효하지 않은 경우 처리
    if (!access_token || typeof access_token !== 'string' || type !== 'recovery') {
      setStatus('error');
      setErrorMessage('유효하지 않은 비밀번호 재설정 링크입니다. 다시 요청해주세요.');
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setStatus('error');
      setErrorMessage('모든 필드를 입력해주세요.');
      return;
    }
    
    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (password.length < 8) {
      setStatus('error');
      setErrorMessage('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('idle');
      setErrorMessage('');
      
      // URL의 토큰으로 새 비밀번호 설정
      const { access_token } = router.query;
      
      if (!access_token || typeof access_token !== 'string') {
        throw new Error('유효하지 않은 토큰입니다.');
      }
      
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });
      
      if (error) {
        throw error;
      }
      
      // 성공 시 상태 업데이트
      setStatus('success');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setStatus('error');
      setErrorMessage(err.message || '비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>비밀번호 재설정 - 똥차 게임 관리자</title>
        <meta name="description" content="새 비밀번호를 설정하는 페이지입니다." />
      </Head>

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>새 비밀번호 설정</h1>
          <p className={styles.description}>
            안전한 새 비밀번호를 입력해주세요.
          </p>
          
          {status === 'success' ? (
            <div className={styles.successMessage}>
              <h2>비밀번호 변경 완료</h2>
              <p>비밀번호가 성공적으로 변경되었습니다.</p>
              <p>새 비밀번호로 로그인해주세요.</p>
              <div className={styles.buttonContainer}>
                <button 
                  className={styles.button} 
                  onClick={() => router.push('/login')}
                >
                  로그인 페이지로 이동
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {status === 'error' && (
                <div className={styles.errorMessage}>
                  {errorMessage}
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="password">새 비밀번호</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="새 비밀번호 (8자 이상)"
                  disabled={isSubmitting || status === 'error'}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 확인"
                  disabled={isSubmitting || status === 'error'}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.buttonContainer}>
                <button 
                  type="submit" 
                  className={styles.button}
                  disabled={isSubmitting || status === 'error'}
                >
                  {isSubmitting ? '처리 중...' : '비밀번호 변경'}
                </button>
                
                {status === 'error' && (
                  <button 
                    type="button" 
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={() => router.push('/reset-password/request')}
                  >
                    다시 요청하기
                  </button>
                )}
              </div>
            </form>
          )}
          
          <div className={styles.footer}>
            <a href="/" onClick={(e) => { e.preventDefault(); router.push('/'); }}>
              메인으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordResetPage;