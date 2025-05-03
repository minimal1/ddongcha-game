import { useState, useCallback } from 'react';
import { useSupabaseContext } from '../shared/context/SupabaseProvider';
import { TABLES } from '../shared/config';
import { GameSession, GameQuestion } from '../shared/config/types';

/**
 * 게임 세션 생성 및 관리 훅
 */
export const useGameSession = () => {
  const { supabase } = useSupabaseContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * 새 게임 세션 생성
   */
  const createGameSession = useCallback(async (
    name: string,
    questionIds: string[],
    hostId: string,
    settings?: Partial<GameSession['settings']>
  ) => {
    if (!name || !questionIds.length || !hostId) {
      setError(new Error('게임 세션 생성에 필요한 정보가 부족합니다.'));
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 기본 설정 값 정의
      const defaultSettings: GameSession['settings'] = {
        allowLateJoin: true,
        questionTimer: 30,
        randomizeQuestions: false,
        showResultsAfterEach: true,
        countdownBeforeQuestion: 3
      };
      
      // 설정 병합
      const mergedSettings = { ...defaultSettings, ...settings };
      
      // 질문 순서 섞기 (설정에 따라)
      let finalQuestionIds = [...questionIds];
      if (mergedSettings.randomizeQuestions) {
        finalQuestionIds = finalQuestionIds.sort(() => Math.random() - 0.5);
      }
      
      // 게임 세션 생성
      const { data, error } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .insert({
          name,
          host_id: hostId,
          state: 'waiting',
          questions: finalQuestionIds,
          settings: mergedSettings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data as unknown as GameSession;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('게임 세션 생성 중 오류가 발생했습니다.'));
      console.error('게임 세션 생성 오류:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  /**
   * 게임 세션 조회
   */
  const getGameSession = useCallback(async (gameId: string) => {
    if (!gameId) {
      setError(new Error('게임 ID는 필수 입력사항입니다.'));
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .select('*')
        .eq('id', gameId)
        .single();
        
      if (error) throw error;
      
      return data as unknown as GameSession;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('게임 세션 조회 중 오류가 발생했습니다.'));
      console.error('게임 세션 조회 오류:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  /**
   * 호스트 ID로 게임 세션 목록 조회
   */
  const getGameSessionsByHost = useCallback(async (hostId: string) => {
    if (!hostId) {
      setError(new Error('호스트 ID는 필수 입력사항입니다.'));
      return [];
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .select('*')
        .eq('host_id', hostId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data as unknown as GameSession[];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('게임 세션 목록 조회 중 오류가 발생했습니다.'));
      console.error('게임 세션 목록 조회 오류:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  /**
   * 게임 세션 설정 업데이트
   */
  const updateGameSessionSettings = useCallback(async (
    gameId: string,
    settings: Partial<GameSession['settings']>
  ) => {
    if (!gameId) {
      setError(new Error('게임 ID는 필수 입력사항입니다.'));
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 현재 설정 가져오기
      const { data: currentData, error: fetchError } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .select('settings')
        .eq('id', gameId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // 기존 설정과 새 설정 병합
      const updatedSettings = {
        ...currentData.settings,
        ...settings
      };
      
      // 설정 업데이트
      const { error: updateError } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .update({
          settings: updatedSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', gameId);
        
      if (updateError) throw updateError;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('게임 설정 업데이트 중 오류가 발생했습니다.'));
      console.error('게임 설정 업데이트 오류:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  /**
   * 게임 문제 목록 조회
   */
  const getGameQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from(TABLES.QUESTIONS)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data as unknown as GameQuestion[];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('게임 문제 목록 조회 중 오류가 발생했습니다.'));
      console.error('게임 문제 목록 조회 오류:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  /**
   * 게임 문제 생성
   */
  const createGameQuestion = useCallback(async (question: Omit<GameQuestion, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!question.title || !question.content || !question.type) {
      setError(new Error('문제 생성에 필요한 정보가 부족합니다.'));
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 객관식 문제인 경우 정답 검증
      if (question.type === 'multiple' && !question.options?.some(opt => opt.isCorrect)) {
        throw new Error('객관식 문제에는 최소 하나의 정답이 있어야 합니다.');
      }
      
      // 선택지를 PostgreSQL에 맞게 변환 (객관식인 경우)
      const optionsForDB = question.options ? JSON.stringify(question.options) : null;
      
      // 문제 생성
      const { data, error } = await supabase
        .from(TABLES.QUESTIONS)
        .insert({
          title: question.title,
          content: question.content,
          type: question.type,
          options: optionsForDB,
          answer: question.answer,
          image_url: question.imageUrl,
          time_limit: question.timeLimit,
          points: question.points || 1,
          hint: question.hint,
          explanation: question.explanation,
          tags: question.tags,
          difficulty: question.difficulty,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data as unknown as GameQuestion;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('문제 생성 중 오류가 발생했습니다.'));
      console.error('문제 생성 오류:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  /**
   * 게임 문제 업데이트
   */
  const updateGameQuestion = useCallback(async (
    questionId: string,
    updates: Partial<Omit<GameQuestion, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    if (!questionId) {
      setError(new Error('문제 ID는 필수 입력사항입니다.'));
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 객관식 문제이고 옵션이 변경되는 경우 정답 검증
      if (
        updates.type === 'multiple' && 
        updates.options && 
        !updates.options.some(opt => opt.isCorrect)
      ) {
        throw new Error('객관식 문제에는 최소 하나의 정답이 있어야 합니다.');
      }
      
      // 선택지를 PostgreSQL에 맞게 변환 (객관식인 경우)
      const optionsForDB = updates.options ? JSON.stringify(updates.options) : undefined;
      
      // DB 필드 이름에 맞게 변환
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (optionsForDB !== undefined) updateData.options = optionsForDB;
      if (updates.answer !== undefined) updateData.answer = updates.answer;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.timeLimit !== undefined) updateData.time_limit = updates.timeLimit;
      if (updates.points !== undefined) updateData.points = updates.points;
      if (updates.hint !== undefined) updateData.hint = updates.hint;
      if (updates.explanation !== undefined) updateData.explanation = updates.explanation;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
      
      // 문제 업데이트
      const { data, error } = await supabase
        .from(TABLES.QUESTIONS)
        .update(updateData)
        .eq('id', questionId)
        .select()
        .single();
        
      if (error) throw error;
      
      return data as unknown as GameQuestion;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('문제 업데이트 중 오류가 발생했습니다.'));
      console.error('문제 업데이트 오류:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  /**
   * 게임 문제 삭제
   */
  const deleteGameQuestion = useCallback(async (questionId: string) => {
    if (!questionId) {
      setError(new Error('문제 ID는 필수 입력사항입니다.'));
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 문제가 게임 세션에서 사용 중인지 확인
      const { data: sessions, error: sessionsError } = await supabase
        .from(TABLES.GAME_SESSIONS)
        .select('id')
        .contains('questions', [questionId]);
        
      if (sessionsError) throw sessionsError;
      
      if (sessions.length > 0) {
        throw new Error('이 문제는 하나 이상의 게임 세션에서 사용 중입니다. 삭제할 수 없습니다.');
      }
      
      // 문제 삭제
      const { error: deleteError } = await supabase
        .from(TABLES.QUESTIONS)
        .delete()
        .eq('id', questionId);
        
      if (deleteError) throw deleteError;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('문제 삭제 중 오류가 발생했습니다.'));
      console.error('문제 삭제 오류:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  return {
    loading,
    error,
    createGameSession,
    getGameSession,
    getGameSessionsByHost,
    updateGameSessionSettings,
    getGameQuestions,
    createGameQuestion,
    updateGameQuestion,
    deleteGameQuestion
  };
};

export default useGameSession;
