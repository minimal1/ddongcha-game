import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/features/auth/lib/useAuth';
import styles from './ResetPassword.module.css';

/**
 * 비밀번호 재설정 요청 페이지
 * 사용자가 이메일을 입력하여 비밀번호 재설정 링크를 요청
 */
const PasswordResetRequestPage: React.FC = () => {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('idle');
      setErrorMessage('');
      
      const { error } = await resetPassword(email);
      
      if (error) {
        throw error;
      }
      
      // 성공 시 상태 업데이트
      setStatus('success');
    } catch (err: any) {
      console.error('Password reset request error:', err);
      setStatus('error');
      setErrorMessage(err.message || '비밀번호 재설정 이메일 발송 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>비밀번호 재설정 요청 - 똥차 게임 관리자</title>
        <meta name="description" content="비밀번호 재설정 링크를 요청하는 페이지입니다." />
      </Head>

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>비밀번호 재설정</h1>
          <p className={styles.description}>
            계정에 등록된 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
          </p>
          
          {status === 'success' ? (
            <div className={styles.successMessage}>
              <h2>이메일을 확인해주세요</h2>
              <p>비밀번호 재설정 링크가 {email}로 발송되었습니다.</p>
              <p>이메일이 오지 않은 경우 스팸함을 확인해보시거나 다시 시도해주세요.</p>
              <div className={styles.buttonContainer}>
                <button 
                  className={styles.button} 
                  onClick={() => router.push('/login')}
                >
                  로그인 페이지로 돌아가기
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
                <label htmlFor="email">이메일</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  disabled={isSubmitting}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.buttonContainer}>
                <button 
                  type="submit" 
                  className={styles.button}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '처리 중...' : '비밀번호 재설정 링크 받기'}
                </button>
                <button 
                  type="button" 
                  className={`${styles.button} ${styles.secondaryButton}`}
                  onClick={() => router.push('/login')}
                  disabled={isSubmitting}
                >
                  취소
                </button>
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

export default PasswordResetRequestPage;