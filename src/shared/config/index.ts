// 모든 설정 모듈 내보내기
export * from './supabase';
export * from './storage';
export * from './realtime';

// 추가 설정이 필요한 경우 여기에 추가

// 게임 상태 상수
export const GAME_STATES = {
  WAITING: 'waiting',
  QUESTION: 'question',
  RESULT: 'result',
  ENDED: 'ended',
};

// 랜덤 닉네임 생성을 위한 설정
export const NICKNAME_GENERATOR = {
  ADJECTIVES: [
    '즐거운', '행복한', '신나는', '재미있는', '멋진',
    '놀라운', '귀여운', '활발한', '열정적인', '화려한',
  ],
  NOUNS: [
    '호랑이', '강아지', '고양이', '토끼', '판다',
    '코끼리', '거북이', '여우', '사자', '기린',
  ],
};

// 앱 전역 설정
export const APP_CONFIG = {
  MAX_PLAYERS_PER_GAME: 30,
  DEFAULT_QUESTION_TIME: 30, // 초 단위
  MAX_GAME_DURATION: 60 * 60, // 1시간(초 단위)
  ANSWER_SUBMIT_GRACE_PERIOD: 2, // 추가 시간(초 단위)
  MAX_NICKNAME_LENGTH: 12,
};

// 기본 타이머 설정
export const TIMER_CONFIG = {
  TICK_INTERVAL: 1000, // 1초
  WARNING_THRESHOLD: 10, // 남은 시간이 10초 이하일 때 경고
};
