import { useState, useEffect, useCallback } from 'react';
import { useSupabaseContext } from '../shared/context/SupabaseProvider';
import { 
  GameSession, 
  GameQuestion, 
  Player, 
  PlayerAnswer,
  GameState
} from '../shared/config/types';
import { TABLES } from '../shared/config';
import { subscribeToGameSession, unsubscribeFromGameSession } from '../shared/config/realtime';
import { RealtimeChannel } from '@supabase/supabase-js';

// 게임 상태 관리 훅
export const useGameState = (gameId?: string) => {
  const { supabase } = useSupabaseContext();
  
  // 상태 관리
  const [session, setSession] = useState<GameSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // 게임 세션 로딩
  const loadGameSession = useCallback(async () => {
    if (!gameId) return;

    try {
      setLoading(true);
      
      // 게임 세션 조회
      const { data: sessionData, error: sessionError } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .select('*')
        .eq('id', gameId)
        .single();

      if (sessionError) throw sessionError;
      if (!sessionData) throw new Error('Game session not found');

      setSession(sessionData as unknown as GameSession);

      // 현재 문제 조회 (있는 경우)
      if (sessionData.current_question_id) {
        const { data: questionData, error: questionError } = await supabase
          .from(TABLES.QUESTIONS)
          .select('*')
          .eq('id', sessionData.current_question_id)
          .single();

        if (questionError) throw questionError;
        setCurrentQuestion(questionData as unknown as GameQuestion);
      }

      // 플레이어 조회
      const { data: playersData, error: playersError } = await supabase
        .from(TABLES.PLAYERS)
        .select('*')
        .eq('game_id', gameId);

      if (playersError) throw playersError;
      setPlayers(playersData as unknown as Player[]);

      // 플레이어 답변 조회 (현재 문제에 대한)
      if (sessionData.current_question_id) {
        const { data: answersData, error: answersError } = await supabase
          .from(TABLES.PLAYER_ANSWERS)
          .select('*')
          .eq('game_id', gameId)
          .eq('question_id', sessionData.current_question_id);

        if (answersError) throw answersError;
        setAnswers(answersData as unknown as PlayerAnswer[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error loading game session'));
      console.error('Error loading game session:', err);
    } finally {
      setLoading(false);
    }
  }, [gameId, supabase]);

  // 실시간 업데이트 구독
  const subscribeToRealtime = useCallback(() => {
    if (!gameId) return;

    const newChannel = subscribeToGameSession(gameId, {
      // 플레이어 참가 이벤트
      onPlayerJoin: (payload) => {
        setPlayers((prevPlayers) => {
          // 이미 존재하는 플레이어라면 업데이트
          const existingPlayerIndex = prevPlayers.findIndex(p => p.id === payload.id);
          if (existingPlayerIndex >= 0) {
            const updatedPlayers = [...prevPlayers];
            updatedPlayers[existingPlayerIndex] = payload as unknown as Player;
            return updatedPlayers;
          }
          // 새 플레이어 추가
          return [...prevPlayers, payload as unknown as Player];
        });
      },
      
      // 플레이어 답변 이벤트
      onPlayerAnswer: (payload) => {
        setAnswers((prevAnswers) => {
          // 이미 존재하는 답변이라면 업데이트
          const existingAnswerIndex = prevAnswers.findIndex(a => a.id === payload.id);
          if (existingAnswerIndex >= 0) {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[existingAnswerIndex] = payload as unknown as PlayerAnswer;
            return updatedAnswers;
          }
          // 새 답변 추가
          return [...prevAnswers, payload as unknown as PlayerAnswer];
        });

        // 플레이어 점수 업데이트
        setPlayers((prevPlayers) => {
          const playerIndex = prevPlayers.findIndex(p => p.id === payload.player_id);
          if (playerIndex < 0) return prevPlayers;

          const updatedPlayers = [...prevPlayers];
          const player = updatedPlayers[playerIndex];
          
          // 정답인 경우 점수 증가
          if (payload.is_correct) {
            updatedPlayers[playerIndex] = {
              ...player,
              score: player.score + (currentQuestion?.points || 1)
            };
          }
          
          return updatedPlayers;
        });
      },
      
      // 게임 상태 변경 이벤트
      onGameStateChange: async (payload) => {
        setSession(payload as unknown as GameSession);
        
        // 현재 문제가 변경된 경우
        if (payload.current_question_id !== session?.currentQuestionId) {
          try {
            // 새 문제 조회
            const { data: questionData, error: questionError } = await supabase
              .from(TABLES.QUESTIONS)
              .select('*')
              .eq('id', payload.current_question_id)
              .single();

            if (questionError) throw questionError;
            setCurrentQuestion(questionData as unknown as GameQuestion);
            
            // 새 문제에 대한 답변 초기화
            setAnswers([]);
          } catch (err) {
            console.error('Error loading new question:', err);
          }
        }
      },
      
      // 에러 처리
      onError: (err) => {
        console.error('Realtime subscription error:', err);
        setError(new Error('Realtime subscription error'));
      }
    });

    setChannel(newChannel);
    return newChannel;
  }, [gameId, session?.currentQuestionId, supabase, currentQuestion]);

  // 컴포넌트 마운트 시 초기 데이터 로딩 및 실시간 구독
  useEffect(() => {
    if (!gameId) return;

    // 초기 데이터 로딩
    loadGameSession();
    
    // 실시간 구독
    const channel = subscribeToRealtime();
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (channel) {
        unsubscribeFromGameSession(channel);
      }
    };
  }, [gameId, loadGameSession, subscribeToRealtime]);

  // 게임 시작 함수
  const startGame = async () => {
    if (!gameId || !session) return;

    try {
      const { error } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .update({
          state: 'question' as GameState,
          current_question_index: 0,
          current_question_id: session.questions[0],
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error starting game'));
      console.error('Error starting game:', err);
    }
  };

  // 다음 문제로 이동 함수
  const nextQuestion = async () => {
    if (!gameId || !session || session.currentQuestionIndex === undefined) return;

    try {
      const nextIndex = session.currentQuestionIndex + 1;
      
      // 모든 문제를 다 풀었다면 게임 종료
      if (nextIndex >= session.questions.length) {
        const { error } = await supabase
          .from(TABLES.GAME_SESSIONS)
          .update({
            state: 'ended' as GameState,
            current_question_id: null,
            current_question_index: null,
            ended_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', gameId);

        if (error) throw error;
        return;
      }

      // 다음 문제로 이동
      const { error } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .update({
          current_question_index: nextIndex,
          current_question_id: session.questions[nextIndex],
          state: 'question' as GameState,
          updated_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error moving to next question'));
      console.error('Error moving to next question:', err);
    }
  };

  // 결과 표시 함수
  const showResults = async () => {
    if (!gameId) return;

    try {
      const { error } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .update({
          state: 'result' as GameState,
          updated_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error showing results'));
      console.error('Error showing results:', err);
    }
  };

  // 게임 종료 함수
  const endGame = async () => {
    if (!gameId) return;

    try {
      const { error } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .update({
          state: 'ended' as GameState,
          ended_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error ending game'));
      console.error('Error ending game:', err);
    }
  };

  // 플레이어 오답 처리 함수 ("땡" 기능)
  const markPlayerWrong = async (playerId: string) => {
    if (!gameId || !session?.currentQuestionId) return;

    try {
      // 플레이어가 이미 답변을 제출했는지 확인
      const { data, error: checkError } = await supabase
        .from(TABLES.PLAYER_ANSWERS)
        .select('*')
        .eq('game_id', gameId)
        .eq('player_id', playerId)
        .eq('question_id', session.currentQuestionId)
        .maybeSingle();

      if (checkError) throw checkError;

      // 이미 답변이 있다면 업데이트, 없다면 새로 생성
      if (data) {
        const { error } = await supabase
          .from(TABLES.PLAYER_ANSWERS)
          .update({
            is_correct: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(TABLES.PLAYER_ANSWERS)
          .insert({
            game_id: gameId,
            player_id: playerId,
            question_id: session.currentQuestionId,
            answer: '[땡]', // 시스템에 의한 오답 표시
            is_correct: false,
            response_time: 0, // 시스템에 의한 오답은 응답 시간 0으로 설정
            submitted_at: new Date().toISOString()
          });

        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error marking player wrong'));
      console.error('Error marking player wrong:', err);
    }
  };

  return {
    session,
    currentQuestion,
    players,
    answers,
    loading,
    error,
    startGame,
    nextQuestion,
    showResults,
    endGame,
    markPlayerWrong,
    refreshData: loadGameSession
  };
};

export default useGameState;
