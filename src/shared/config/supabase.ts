import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 인스턴스를 한 번만 생성하도록 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// 게임 관련 데이터베이스 테이블 상수 정의
export const TABLES = {
  GAME_SESSIONS: 'game_sessions',
  QUESTIONS: 'game_questions',
  PLAYERS: 'game_players',
  PLAYER_ANSWERS: 'player_answers',
};

// Supabase 기능 래퍼 함수들
export const supabaseAdmin = {
  // 여기에 관리자 기능을 위한 함수들을 추가할 수 있습니다
};

export const supabaseClient = {
  // 여기에 클라이언트 기능을 위한 함수들을 추가할 수 있습니다
};
