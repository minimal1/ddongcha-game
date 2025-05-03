import { useState, useEffect, useCallback, useRef } from 'react';
import { TIMER_CONFIG } from '../shared/config';

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

interface TimerOptions {
  duration?: number; // 초 단위
  autoStart?: boolean;
  onTick?: (remainingTime: number) => void;
  onComplete?: () => void;
  onWarning?: (remainingTime: number) => void;
  warningThreshold?: number; // 초 단위
}

/**
 * 게임 타이머 관리 훅
 */
export const useGameTimer = (options: TimerOptions = {}) => {
  const {
    duration = 30,
    autoStart = false,
    onTick,
    onComplete,
    onWarning,
    warningThreshold = TIMER_CONFIG.WARNING_THRESHOLD
  } = options;

  const [remainingTime, setRemainingTime] = useState(duration);
  const [status, setStatus] = useState<TimerStatus>(autoStart ? 'running' : 'idle');
  const [progress, setProgress] = useState(100); // 진행률 (0-100%)
  
  // useRef를 사용하여 타이머 ID와 시작 시간을 저장
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  
  // 타이머 시작 함수
  const startTimer = useCallback(() => {
    // 이미 실행 중이면 무시
    if (status === 'running') return;
    
    // 완료된 타이머면 리셋
    if (status === 'completed') {
      setRemainingTime(duration);
      setProgress(100);
    }
    
    // 타이머 상태 업데이트
    setStatus('running');
    
    // 현재 시간 저장
    startTimeRef.current = Date.now();
    
    // 일시 정지였으면 중단 시간 고려
    if (status === 'paused') {
      startTimeRef.current -= pausedTimeRef.current * 1000;
    } else {
      pausedTimeRef.current = 0;
    }
    
    // 타이머 설정
    timerRef.current = setInterval(() => {
      // 경과 시간 계산 (초 단위)
      const elapsedTime = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
      const newRemainingTime = Math.max(0, duration - elapsedTime);
      
      // 타이머 업데이트
      setRemainingTime(newRemainingTime);
      
      // 진행률 계산
      const newProgress = Math.max(0, (newRemainingTime / duration) * 100);
      setProgress(newProgress);
      
      // 매 틱마다 콜백 호출
      if (onTick) {
        onTick(newRemainingTime);
      }
      
      // 경고 시간에 도달하면 콜백 호출
      if (onWarning && newRemainingTime <= warningThreshold && newRemainingTime > 0) {
        onWarning(newRemainingTime);
      }
      
      // 타이머 완료 시
      if (newRemainingTime <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        setStatus('completed');
        setRemainingTime(0);
        setProgress(0);
        
        // 완료 콜백 호출
        if (onComplete) {
          onComplete();
        }
      }
    }, TIMER_CONFIG.TICK_INTERVAL);
  }, [duration, status, onTick, onComplete, onWarning, warningThreshold]);
  
  // 타이머 일시 정지 함수
  const pauseTimer = useCallback(() => {
    if (status !== 'running' || !timerRef.current) return;
    
    // 타이머 중지
    clearInterval(timerRef.current);
    timerRef.current = null;
    
    // 상태 업데이트
    setStatus('paused');
    
    // 일시 정지 시간 저장
    pausedTimeRef.current = duration - remainingTime;
  }, [status, duration, remainingTime]);
  
  // 타이머 재설정 함수
  const resetTimer = useCallback(() => {
    // 실행 중인 타이머 중지
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // 상태 초기화
    setStatus('idle');
    setRemainingTime(duration);
    setProgress(100);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [duration]);
  
  // 수동으로 타이머 완료 처리 함수
  const completeTimer = useCallback(() => {
    // 실행 중인 타이머 중지
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // 상태 업데이트
    setStatus('completed');
    setRemainingTime(0);
    setProgress(0);
    
    // 완료 콜백 호출
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);
  
  // 타이머 시간 변경 함수
  const setTimerDuration = useCallback((newDuration: number) => {
    // 실행 중이면 중지
    const wasRunning = status === 'running';
    if (wasRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // 타이머 재설정
    setRemainingTime(newDuration);
    setProgress(100);
    
    // 실행 중이었다면 재시작
    if (wasRunning) {
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      startTimer();
    }
  }, [status, startTimer]);
  
  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
  
  // 자동 시작 옵션 처리
  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
  }, [autoStart, startTimer]);
  
  // 시간 포맷 함수 (예: 60초 -> "01:00")
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);
  
  return {
    remainingTime,
    formattedTime: formatTime(remainingTime),
    progress,
    status,
    isRunning: status === 'running',
    isPaused: status === 'paused',
    isCompleted: status === 'completed',
    isIdle: status === 'idle',
    startTimer,
    pauseTimer,
    resetTimer,
    completeTimer,
    setTimerDuration
  };
};

export default useGameTimer;
