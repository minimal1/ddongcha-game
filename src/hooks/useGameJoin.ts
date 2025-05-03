import { useState, useCallback } from 'react';
import { useSupabaseContext } from '../shared/context/SupabaseProvider';
import { TABLES, NICKNAME_GENERATOR } from '../shared/config';
import { Player, GameSession } from '../shared/config/types';

/**
 * 게임 참가 관련 훅
 */
export const useGameJoin = () => {
  const { supabase } = useSupabaseContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  
  /**
   * 랜덤 닉네임 생성
   */
  const generateRandomName = useCallback(() => {
    const { ADJECTIVES, NOUNS } = NICKNAME_GENERATOR;
    
    // 무작위 형용사와 명사 선택
    const randomAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const randomNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    
    // 닉네임 조합
    return `${randomAdjective} ${randomNoun}`;
  }, []);
  
  /**
   * 이름으로 게임 참가
   */
  const joinGame = useCallback(async (gameId: string, name: string) => {
    if (!gameId || !name) {
      setError(new Error('게임 ID와 이름은 필수 입력사항입니다.'));
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 먼저 게임이 존재하는지, 참가 가능한지 확인
      const { data: gameData, error: gameError } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .select('*')
        .eq('id', gameId)
        .single();
        
      if (gameError) throw gameError;
      if (!gameData) throw new Error('게임을 찾을 수 없습니다.');
        
      const gameSession = gameData as unknown as GameSession;
      
      // 게임이 이미 시작됐고 늦은 참가가 허용되지 않은 경우
      if (
        gameSession.state !== 'waiting' && 
        !gameSession.settings.allowLateJoin
      ) {
        throw new Error('이 게임은 이미 시작되었으며 늦은 참가를 허용하지 않습니다.');
      }
      
      // 이름 중복 확인
      const { data: existingPlayers, error: playersError } = await supabase
        .from(TABLES.PLAYERS)
        .select('name')
        .eq('game_id', gameId);
        
      if (playersError) throw playersError;
      
      const isDuplicate = existingPlayers.some(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );
      
      if (isDuplicate) {
        throw new Error('이미 사용 중인 이름입니다. 다른 이름을 선택해주세요.');
      }
      
      // 플레이어 생성
      const { data: playerData, error: playerError } = await supabase
        .from(TABLES.PLAYERS)
        .insert({
          game_id: gameId,
          name: name,
          score: 0,
          is_active: true,
          last_active: new Date().toISOString(),
          joined_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (playerError) throw playerError;
      
      // 플레이어 정보 저장
      const newPlayer = playerData as unknown as Player;
      setPlayer(newPlayer);
      
      // 로컬 스토리지에 플레이어 ID 저장 (새로고침해도 유지)
      localStorage.setItem(`game_${gameId}_player`, JSON.stringify(newPlayer));
      
      return newPlayer;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('게임 참가 중 오류가 발생했습니다.'));
      console.error('게임 참가 오류:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  /**
   * 랜덤 이름으로 게임 참가
   */
  const joinGameWithRandomName = useCallback(async (gameId: string) => {
    // 랜덤 닉네임 생성 및 중복 확인
    let randomName = generateRandomName();
    let attempt = 0;
    const maxAttempts = 10;
    
    try {
      // 이름 중복 확인 및 재시도
      while (attempt < maxAttempts) {
        const { data: existingPlayers, error: playersError } = await supabase
          .from(TABLES.PLAYERS)
          .select('name')
          .eq('game_id', gameId);
          
        if (playersError) throw playersError;
        
        const isDuplicate = existingPlayers.some(
          (p) => p.name.toLowerCase() === randomName.toLowerCase()
        );
        
        if (!isDuplicate) {
          break;
        }
        
        // 중복된 이름이면 새로운 이름 생성
        randomName = generateRandomName();
        attempt++;
      }
      
      if (attempt >= maxAttempts) {
        throw new Error('중복되지 않는 이름을 생성할 수 없습니다. 다시 시도해주세요.');
      }
      
      // 생성된 랜덤 이름으로 게임 참가
      return joinGame(gameId, randomName);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('랜덤 이름 생성 중 오류가 발생했습니다.'));
      console.error('랜덤 이름 생성 오류:', err);
      return null;
    }
  }, [generateRandomName, joinGame, supabase]);
  
  /**
   * 로컬 스토리지에서 이전 플레이어 정보 복구
   */
  const recoverPlayer = useCallback(async (gameId: string) => {
    if (!gameId) return null;
    
    try {
      // 로컬 스토리지에서 플레이어 정보 가져오기
      const savedPlayer = localStorage.getItem(`game_${gameId}_player`);
      if (!savedPlayer) return null;
      
      const parsedPlayer = JSON.parse(savedPlayer) as Player;
      
      // 플레이어가 여전히 존재하는지 확인
      const { data: playerData, error: playerError } = await supabase
        .from(TABLES.PLAYERS)
        .select('*')
        .eq('id', parsedPlayer.id)
        .eq('game_id', gameId)
        .single();
        
      if (playerError || !playerData) {
        // 플레이어가 없으면 로컬 스토리지에서 제거
        localStorage.removeItem(`game_${gameId}_player`);
        return null;
      }
      
      // 플레이어 상태 업데이트 (재접속 시)
      const { error: updateError } = await supabase
        .from(TABLES.PLAYERS)
        .update({
          is_active: true,
          last_active: new Date().toISOString()
        })
        .eq('id', parsedPlayer.id);
        
      if (updateError) throw updateError;
      
      // 최신 플레이어 정보 저장
      setPlayer(playerData as unknown as Player);
      return playerData as unknown as Player;
    } catch (err) {
      console.error('플레이어 정보 복구 오류:', err);
      return null;
    }
  }, [supabase]);
  
  /**
   * 게임에 답변 제출
   */
  const submitAnswer = useCallback(async (
    gameId: string,
    playerId: string,
    questionId: string,
    answer: string,
    startTime: number // 밀리초 단위 타임스탬프 (문제 표시 시점)
  ) => {
    if (!gameId || !playerId || !questionId || !answer) {
      setError(new Error('답변 제출에 필요한 정보가 부족합니다.'));
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 응답 시간 계산 (밀리초)
      const responseTime = Date.now() - startTime;
      
      // 문제 정보 가져오기 (정답 확인용)
      const { data: questionData, error: questionError } = await supabase
        .from(TABLES.QUESTIONS)
        .select('*')
        .eq('id', questionId)
        .single();
        
      if (questionError) throw questionError;
      
      // 정답 확인
      let isCorrect = false;
      
      if (questionData.type === 'text') {
        // 주관식: 대소문자 무시, 공백 제거 후 비교
        isCorrect = answer.trim().toLowerCase() === questionData.answer.trim().toLowerCase();
      } else if (questionData.type === 'multiple') {
        // 객관식: 선택한 옵션 ID가 정답인지 확인
        isCorrect = answer === questionData.answer;
      } else if (questionData.type === 'single') {
        // 단일 선택: 대소문자 무시, 공백 제거 후 비교
        isCorrect = answer.trim().toLowerCase() === questionData.answer.trim().toLowerCase();
      }
      
      // 이미 같은 문제에 답변했는지 확인
      const { data: existingAnswer, error: checkError } = await supabase
        .from(TABLES.PLAYER_ANSWERS)
        .select('*')
        .eq('game_id', gameId)
        .eq('player_id', playerId)
        .eq('question_id', questionId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // 이미 답변이 있으면 업데이트, 없으면 새로 생성
      if (existingAnswer) {
        const { data: updatedAnswer, error: updateError } = await supabase
          .from(TABLES.PLAYER_ANSWERS)
          .update({
            answer,
            is_correct: isCorrect,
            response_time: responseTime,
            submitted_at: new Date().toISOString()
          })
          .eq('id', existingAnswer.id)
          .select()
          .single();
          
        if (updateError) throw updateError;
        
        return updatedAnswer;
      } else {
        const { data: newAnswer, error: insertError } = await supabase
          .from(TABLES.PLAYER_ANSWERS)
          .insert({
            game_id: gameId,
            player_id: playerId,
            question_id: questionId,
            answer,
            is_correct: isCorrect,
            response_time: responseTime,
            submitted_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (insertError) throw insertError;
        
        // 정답이면 플레이어 점수 업데이트
        if (isCorrect) {
          const points = questionData.points || 1;
          
          const { error: playerError } = await supabase
            .from(TABLES.PLAYERS)
            .update({
              score: supabase.rpc('increment_score', { score_increment: points }),
              last_active: new Date().toISOString()
            })
            .eq('id', playerId);
            
          if (playerError) throw playerError;
        }
        
        return newAnswer;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('답변 제출 중 오류가 발생했습니다.'));
      console.error('답변 제출 오류:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  return {
    player,
    loading,
    error,
    generateRandomName,
    joinGame,
    joinGameWithRandomName,
    recoverPlayer,
    submitAnswer
  };
};

export default useGameJoin;
