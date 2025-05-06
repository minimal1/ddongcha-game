import { useState, useEffect, useCallback } from "react";
import { useSupabaseContext } from "@/shared/supabase/lib/SupabaseProvider";
import { TABLES } from "@/shared/supabase/lib/supabase";
import {
  Quiz,
  TriviaQuizQuestion,
  MovieQuizQuestion,
  PhotoYearQuizQuestion,
  GuessWhoQuizQuestion,
} from "../model/quiz.model";
import { QuestionType } from "@/entities/shared/quiz/model/question-type.model";

interface UseQuizDataParams<T extends QuestionType> {
  questionType?: T;
  limit?: number;
}

type QuizData<T extends QuestionType> = T extends "trivia"
  ? TriviaQuizQuestion
  : T extends "movie"
  ? MovieQuizQuestion
  : T extends "photo-year"
  ? PhotoYearQuizQuestion
  : T extends "guess-who"
  ? GuessWhoQuizQuestion
  : never;

interface UseQuizDataReturn<T extends QuestionType> {
  questions: QuizData<T>[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Supabase에서 퀴즈 데이터를 가져오는 커스텀 훅
 * @param params 퀴즈 조회 파라미터 (타입, 제한 개수)
 * @returns 퀴즈 질문 목록, 로딩 상태, 에러, 다시 가져오기 함수
 */
export default function useQuizData<T extends QuestionType>({
  questionType,
  limit = 10,
}: UseQuizDataParams<T> = {}): UseQuizDataReturn<T> {
  const [questions, setQuestions] = useState<QuizData<T>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Supabase 컨텍스트에서 클라이언트 가져오기
  const { supabase } = useSupabaseContext();

  // 퀴즈 데이터를 가져오는 함수
  const fetchQuizData = useCallback(async () => {
    try {
      setLoading(true);

      // Supabase 쿼리 빌더
      let query = supabase
        .from(TABLES.QUESTIONS)
        .select("*")
        .limit(limit || 10);

      // 조건부 필터링
      if (questionType) {
        // 퀴즈 타입에 따라 필터링 (이제 question_type 필드를 직접 사용)
        query = query.eq("question_type", questionType);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        // 데이터를 적절한 모델 형태로 변환
        const formattedQuestions = data.map((item) => {
          const baseQuestion = {
            uuid: item.uuid, // id → uuid로 변경됨
            question: item.question, // content → question으로 변경됨
            answer: item.answer,
            hints: item.hints, // hint → hints(배열)로 변경됨
          };

          // 퀴즈 타입에 따라 다른 처리
          switch (item.question_type as QuestionType) {
            case "trivia":
              return {
                ...baseQuestion,
                questionType: "trivia",
              } as TriviaQuizQuestion;

            case "movie":
              return {
                ...baseQuestion,
                questionType: "movie",
                imageUrls: item.image_urls || [],
              } as MovieQuizQuestion;

            case "photo-year":
              return {
                ...baseQuestion,
                questionType: "photo-year",
                imageUrls: item.image_urls || [],
              } as PhotoYearQuizQuestion;

            case "guess-who":
              return {
                ...baseQuestion,
                questionType: "guess-who",
                imageUrls: item.image_urls || [],
              } as GuessWhoQuizQuestion;

            default:
              // 기본값으로 Trivia Quiz 반환
              return {
                ...baseQuestion,
                questionType: "trivia",
              } as TriviaQuizQuestion;
          }
        });

        setQuestions(formattedQuestions as QuizData<T>[]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("퀴즈 데이터를 가져오는 중 오류가 발생했습니다.")
      );
      console.error("퀴즈 데이터를 가져오는 중 오류:", err);
    } finally {
      setLoading(false);
    }
  }, [questionType, supabase, limit]);

  // 컴포넌트 마운트 시와 의존성 변경 시 데이터 가져오기
  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

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
}
