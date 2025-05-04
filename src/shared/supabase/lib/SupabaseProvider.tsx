import React, { createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useSupabase } from './useSupabase';
import { supabase } from './supabase';

// Supabase 컨텍스트 인터페이스 정의
interface SupabaseContextValue {
  supabase: typeof supabase;
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
}

// 컨텍스트 기본값
const defaultContextValue: SupabaseContextValue = {
  supabase,
  session: null,
  user: null,
  loading: true,
  error: null,
};

// Supabase 컨텍스트 생성
const SupabaseContext = createContext<SupabaseContextValue>(defaultContextValue);

// Supabase 컨텍스트 사용을 위한 커스텀 훅
export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabaseContext must be used within a SupabaseProvider');
  }
  return context;
};

// Supabase Provider 컴포넌트 정의
interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  // useSupabase 훅을 사용하여 세션 정보 가져오기
  const { session, loading, error, user } = useSupabase();

  // 컨텍스트 값 구성
  const value: SupabaseContextValue = {
    supabase,
    session,
    user,
    loading,
    error,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
