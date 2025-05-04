import { useState, useEffect } from 'react';
import { useSupabaseContext } from '@/shared/supabase/lib/SupabaseProvider';
import { TABLES } from '@/shared/supabase/lib/supabase';
import { TriviaQuestion, MovieQuestion, GuessWhoQuestion, PhotoYearQuestion } from '../model/quiz.model';

// 퀴즈 타입을 정의합니다
export type QuizType = 'trivia' | 'movie' | 'guessWho' | 'photoYear';

// 모든 퀴즈 타입을 하나로 관리하는 Union Type
export type QuizQuestion = TriviaQuestion | MovieQuestion | GuessWhoQuestion | PhotoYearQuestion;

interface UseQuizDataParams {
  type?: QuizType;
  limit?: number;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface UseQuizDataReturn {
  questions: QuizQuestion[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Supabase에서 퀴즈 데이터를 가져오는 커스텀 훅
 * @param params 퀴즈 조회 파라미터 (타입, 제한 개수, 태그, 난이도)
 * @returns 퀴즈 질문 목록, 로딩 상태, 에러, 다시 가져오기 함수
 */
export const useQuizData = ({
  type,
  limit = 10,
  tags,
  difficulty
}: UseQuizDataParams = {}): UseQuizDataReturn => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Supabase 컨텍스트에서 클라이언트와 세션 가져오기
  const { supabase } = useSupabaseContext();

  // 퀴즈 데이터를 가져오는 함수
  const fetchQuizData = async () => {
    try {
      setLoading(true);
      
      // Supabase 쿼리 빌더
      let query = supabase
        .from(TABLES.QUESTIONS)
        .select('*')
        .limit(limit);
      
      // 조건부 필터링
      if (type) {
        // 퀴즈 타입에 따라 필터링
        switch (type) {
          case 'trivia':
            query = query.eq('type', 'text'); // 지식 퀴즈는 text 타입인 것 같습니다
            break;
          case 'movie':
            query = query.eq('type', 'multiple'); // 영화 퀴즈는 multiple 타입인 것 같습니다
            break;
          case 'guessWho':
          case 'photoYear':
            // 이미지 경로가 있는 퀴즈로 필터링
            query = query.not('image_url', 'is', null);
            break;
        }
      }
      
      // 태그 필터링
      if (tags && tags.length > 0) {
        query = query.contains('tags', tags);
      }
      
      // 난이도 필터링
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (data) {
        // 데이터를 적절한 모델 형태로 변환
        const formattedQuestions = data.map(item => {
          // 공통 필드
          const question: Partial<QuizQuestion> = {
            id: item.id,
          };
          
          // 퀴즈 타입에 따라 다른 처리
          if (item.type === 'text' || item.type === 'single' || item.type === 'multiple') {
            // TriviaQuestion 또는 MovieQuestion 형태로 변환
            const options = Array.isArray(item.options) 
              ? item.options.map((opt: any) => opt.text) 
              : [];
            
            const formattedQuestion: TriviaQuestion = {
              ...question as TriviaQuestion,
              question: item.content,
              options,
              correctAnswer: item.answer,
            };
            
            return formattedQuestion;
          } else if (item.image_url) {
            // GuessWhoQuestion 또는 PhotoYearQuestion 형태로 변환
            if (type === 'guessWho') {
              const guessWhoQuestion: GuessWhoQuestion = {
                ...question as GuessWhoQuestion,
                imagePath: item.image_url,
                zoomLevels: item.settings?.zoomLevels || 3,
                correctAnswer: item.answer,
                options: Array.isArray(item.options) 
                  ? item.options.map((opt: any) => opt.text) 
                  : [],
              };
              return guessWhoQuestion;
            } else {
              // PhotoYearQuestion 처리
              const photoYearQuestion: PhotoYearQuestion = {
                ...question as PhotoYearQuestion,
                imagePath: item.image_url,
                minYear: item.settings?.minYear || 1900,
                maxYear: item.settings?.maxYear || 2025,
                correctAnswer: parseInt(item.answer, 10),
                options: Array.isArray(item.options) 
                  ? item.options.map((opt: any) => parseInt(opt.text, 10)) 
                  : [],
              };
              return photoYearQuestion;
            }
          }
          
          // 기본 값으로 TriviaQuestion 반환
          return {
            ...question,
            question: item.content,
            options: [],
            correctAnswer: item.answer,
          } as TriviaQuestion;
        });
        
        setQuestions(formattedQuestions);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('퀴즈 데이터를 가져오는 중 오류가 발생했습니다.'));
      console.error('퀴즈 데이터를 가져오는 중 오류:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 컴포넌트 마운트 시와 의존성 변경 시 데이터 가져오기
  useEffect(() => {
    fetchQuizData();
  }, [type, limit, JSON.stringify(tags), difficulty]);
  
  // 외부에서 데이터를 다시 가져올 수 있는 함수 제공
  const refetch = async () => {
    await fetchQuizData();
  };
  
  return {
    questions,
    loading,
    error,
    refetch,
  };
};

export default useQuizData;