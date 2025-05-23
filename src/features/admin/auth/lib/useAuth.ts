import { useState, useCallback } from "react";
import { useSupabaseContext } from "@/shared/supabase/lib/SupabaseProvider";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/router";

/**
 * 인증 관련 기능을 제공하는 커스텀 훅
 * 로그인, 로그아웃, 비밀번호 재설정, 회원가입 등의 기능을 제공
 */
export const useAuth = () => {
  const { supabase, user } = useSupabaseContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

        // 로그인 성공 시 리디렉션
        const redirectTo = (router.query.redirect as string) || '/admin';
        router.push(redirectTo);
        
        return { data, error: null };
      } catch (err) {
        const authError = err as AuthError;
        setError(authError.message || "로그인 중 오류가 발생했습니다.");
        return { data: null, error: authError };
      } finally {
        setLoading(false);
      }
    },
    [supabase, router]
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

      // 로그아웃 성공 시 로그인 페이지로 리디렉션
      router.push('/admin/login');
      
      return { error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "로그아웃 중 오류가 발생했습니다.");
      return { error: authError };
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  return {
    user,
    loading,
    error,
    signInWithPassword,
    signOut,
  };
};

export default useAuth;