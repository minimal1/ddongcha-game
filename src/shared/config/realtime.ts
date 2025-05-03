import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, TABLES } from './supabase';

// 채널 이름 생성 함수
const createChannelName = (gameId: string) => `game:${gameId}`;

// 게임 세션에 대한 Realtime 채널 구독
export const subscribeToGameSession = (
  gameId: string,
  callbacks: {
    onPlayerJoin?: (payload: any) => void;
    onPlayerAnswer?: (payload: any) => void;
    onGameStateChange?: (payload: any) => void;
    onError?: (error: any) => void;
  }
): RealtimeChannel => {
  // 게임 세션 변경사항 수신 채널 생성
  const channel = supabase.channel(createChannelName(gameId));

  // 플레이어 참가 이벤트 구독
  if (callbacks.onPlayerJoin) {
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: TABLES.PLAYERS,
        filter: `game_id=eq.${gameId}`,
      },
      (payload) => callbacks.onPlayerJoin?.(payload.new)
    );
  }

  // 플레이어 답변 이벤트 구독
  if (callbacks.onPlayerAnswer) {
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: TABLES.PLAYER_ANSWERS,
        filter: `game_id=eq.${gameId}`,
      },
      (payload) => callbacks.onPlayerAnswer?.(payload.new)
    );
  }

  // 게임 상태 변경 이벤트 구독
  if (callbacks.onGameStateChange) {
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: TABLES.GAME_SESSIONS,
        filter: `id=eq.${gameId}`,
      },
      (payload) => callbacks.onGameStateChange?.(payload.new)
    );
  }

  // 에러 처리
  channel.on('error', (error) => {
    console.error('Realtime subscription error:', error);
    callbacks.onError?.(error);
  });

  // 채널 구독 시작
  channel.subscribe((status) => {
    if (status !== 'SUBSCRIBED') {
      console.log(`Subscription status: ${status}`);
    }
  });

  return channel;
};

// 게임 세션 구독 해제
export const unsubscribeFromGameSession = (channel: RealtimeChannel) => {
  channel.unsubscribe();
};

// 채널에 직접 메시지 보내기 (호스트-플레이어 통신용)
export const broadcastToGameChannel = async (
  gameId: string, 
  eventType: string, 
  payload: any
) => {
  try {
    await supabase.channel(createChannelName(gameId)).send({
      type: 'broadcast',
      event: eventType,
      payload,
    });
    return true;
  } catch (error) {
    console.error('Broadcasting error:', error);
    return false;
  }
};
