import { useState, useEffect } from 'react';
import { supabase } from '../shared/config';
import { Session } from '@supabase/supabase-js';

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
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Failed to get session:', err);
      } finally {
        setLoading(false);
      }
    };

    // 초기 세션 가져오기
    getSession();

    // 세션 변경 이벤트 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 정리 함수: 컴포넌트 언마운트 시 구독 해제
    return () => subscription.unsubscribe();
  }, []);

  return { session, loading, error, user: session?.user ?? null };
};

/**
 * Supabase Realtime 구독을 위한 커스텀 훅
 * @param table 구독할 테이블 이름
 * @param filter 필터 설정
 * @param callback 변경사항 발생 시 호출될 콜백 함수
 */
export const useRealtimeSubscription = (
  table: string,
  filter: string,
  callback: (payload: any) => void
) => {
  useEffect(() => {
    // 구독 채널 생성
    const channel = supabase
      .channel(`table-changes-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*', // 모든 이벤트 (INSERT, UPDATE, DELETE)
          schema: 'public',
          table,
          filter,
        },
        callback
      )
      .subscribe();

    // 정리 함수: 컴포넌트 언마운트 시 구독 해제
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, callback]);
};

export default useSupabase;
