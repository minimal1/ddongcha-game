import { useState, useCallback } from "react";
import { useSupabaseContext } from "@/shared/supabase/lib/SupabaseProvider";
import { AuthError } from "@supabase/supabase-js";

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
        setError(authError.message || "로그인 중 오류가 발생했습니다.");
        return { data: null, error: authError };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  return {
    user,
    loading,
    error,
    signInWithPassword,
  };
};

export default useAuth;
