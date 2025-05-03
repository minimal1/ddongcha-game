/**
 * 게임 관련 데이터 타입 정의
 */

// 게임 상태 타입
export type GameState = 'waiting' | 'question' | 'result' | 'ended';

// 문제 타입 (단일 선택, 객관식, 주관식)
export type QuestionType = 'single' | 'multiple' | 'text';

/**
 * 게임 질문 타입
 */
export interface GameQuestion {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  // 객관식 문제를 위한 선택지
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  // 주관식/단일 선택 문제를 위한 정답
  answer?: string;
  // 선택 사항 필드들
  imageUrl?: string;
  timeLimit?: number; // 초 단위, 기본값은 전역 설정에서 가져옴
  points?: number; // 문제 점수, 기본값 1
  hint?: string;
  explanation?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt: string;
  updatedAt: string;
}

/**
 * 게임 세션 타입
 */
export interface GameSession {
  id: string;
  name: string;
  hostId: string; // 진행자 ID
  state: GameState;
  currentQuestionId?: string; // 현재 문제 ID
  currentQuestionIndex?: number; // 현재 문제 인덱스
  questions: string[]; // 문제 ID 목록
  settings: {
    allowLateJoin: boolean; // 게임 시작 후 참여 허용 여부
    questionTimer: number; // 문제당 시간(초)
    randomizeQuestions: boolean; // 문제 순서 섞기
    showResultsAfterEach: boolean; // 각 문제 후 결과 표시
    countdownBeforeQuestion: number; // 문제 시작 전 카운트다운(초)
  };
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 플레이어 타입
 */
export interface Player {
  id: string;
  gameId: string;
  name: string;
  score: number;
  isActive: boolean;
  lastActive: string;
  avatarUrl?: string;
  joinedAt: string;
  answers?: PlayerAnswer[];
}

/**
 * 플레이어 답변 타입
 */
export interface PlayerAnswer {
  id: string;
  gameId: string;
  playerId: string;
  questionId: string;
  answer: string;
  isCorrect: boolean;
  responseTime: number; // 응답 시간(밀리초)
  submittedAt: string;
}

/**
 * 게임 결과 타입
 */
export interface GameResult {
  gameId: string;
  players: {
    id: string;
    name: string;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    rank: number;
  }[];
  questions: {
    id: string;
    title: string;
    correctAnswers: number;
    wrongAnswers: number;
    averageResponseTime: number;
  }[];
  startedAt: string;
  endedAt: string;
  duration: number; // 게임 진행 시간(초)
}
