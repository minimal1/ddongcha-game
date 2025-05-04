import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { Session } from "@supabase/supabase-js";

/**
 * Supabase 인증 및 세션 관리를 위한 커스텀 훅
 * @returns 현재 세션, 로딩 상태, 사용자 객체
 */
export const useSupabase = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 현재 세션 가져오기
    const getSession = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Failed to get session:", err);
      } finally {
        setLoading(false);
      }
    };

    // 초기 세션 가져오기
    getSession();
  }, []);

  return { session, loading, error, user: session?.user ?? null };
};

export default useSupabase;
