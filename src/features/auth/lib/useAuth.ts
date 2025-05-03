import { useState, useCallback } from 'react';
import { useSupabaseContext } from '@/shared/context/SupabaseProvider';
import { AuthError } from '@supabase/supabase-js';

/**
 * 인증 관련 기능을 제공하는 커스텀 훅
 * 로그인, 로그아웃, 비밀번호 재설정, 회원가입 등의 기능을 포함
 */
export const useAuth = () => {
  const { supabase, user } = useSupabaseContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 이메일/비밀번호로 로그인
   */
  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          throw error;
        }
        
        return { data, error: null };
      } catch (err) {
        const authError = err as AuthError;
        setError(authError.message || '로그인 중 오류가 발생했습니다.');
        return { data: null, error: authError };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  /**
   * 로그아웃
   */
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || '로그아웃 중 오류가 발생했습니다.');
      return { error: authError };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /**
   * 비밀번호 재설정 이메일 발송
   */
  const resetPassword = useCallback(
    async (email: string) => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });
        
        if (error) {
          throw error;
        }
        
        return { data, error: null };
      } catch (err) {
        const authError = err as AuthError;
        setError(authError.message || '비밀번호 재설정 이메일 발송 중 오류가 발생했습니다.');
        return { data: null, error: authError };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  /**
   * 관리자 권한 확인
   * 실제 환경에서는 Supabase RLS 또는 커스텀 claims를 통해 확인해야 함
   */
  const checkAdminStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 일반적으로 Supabase의 경우 다음과 같은 방식으로 관리자 권한을 확인할 수 있습니다:
      // 1. RLS 정책을 통해 관리자만 특정 테이블에 접근 가능하도록 설정
      // 2. 사용자에게 custom claims 설정 (JWT에 'role': 'admin' 추가)
      // 3. 별도의 관리자 테이블을 통해 확인
      
      // 여기서는 간단히 사용자가 로그인했는지만 확인하는 것으로 대체합니다.
      // 실제 구현 시에는 더 엄격한 검증이 필요합니다.
      if (!user) {
        return { isAdmin: false, error: null };
      }
      
      // 데모 목적으로 모든 로그인 사용자를 관리자로 취급
      // 실제 환경에서는 아래 주석 처리된 코드와 같은 방식으로 구현해야 함
      /*
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return { isAdmin: !!data, error: null };
      */
      
      return { isAdmin: true, error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || '관리자 권한 확인 중 오류가 발생했습니다.');
      return { isAdmin: false, error: authError };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    signInWithPassword,
    signOut,
    resetPassword,
    checkAdminStatus,
  };
};

export default useAuth;