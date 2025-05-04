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

interface UseQuizDataParams {
  questionType?: QuestionType;
}

interface UseQuizDataReturn {
  questions: Quiz[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Supabase에서 퀴즈 데이터를 가져오는 커스텀 훅
 * @param params 퀴즈 조회 파라미터 (타입)
 * @returns 퀴즈 질문 목록, 로딩 상태, 에러, 다시 가져오기 함수
 */
export default function useQuizData({
  questionType,
}: UseQuizDataParams = {}): UseQuizDataReturn {
  const [questions, setQuestions] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Supabase 컨텍스트에서 클라이언트 가져오기
  const { supabase } = useSupabaseContext();

  // 퀴즈 데이터를 가져오는 함수
  const fetchQuizData = useCallback(async () => {
    try {
      setLoading(true);

      // Supabase 쿼리 빌더
      let query = supabase.from(TABLES.QUESTIONS).select("*");

      // 조건부 필터링
      if (questionType) {
        // 퀴즈 타입에 따라 필터링
        switch (questionType) {
          case "trivia":
            query = query.eq("type", "text");
            break;
          case "movie":
            query = query.eq("type", "multiple");
            break;
          case "photo-year":
          case "guess-who":
            // 이미지 경로가 있는 퀴즈로 필터링
            query = query.not("image_url", "is", null);
            break;
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        // 데이터를 적절한 모델 형태로 변환
        const formattedQuestions = data.map((item) => {
          const baseQuestion = {
            uuid: item.id,
            question: item.content,
            answer: item.answer,
            hints: item.hint ? [item.hint] : undefined,
          };

          // 퀴즈 타입에 따라 다른 처리
          if (item.type === "text") {
            // Trivia Quiz
            return {
              ...baseQuestion,
              questionType: "trivia",
            } as TriviaQuizQuestion;
          } else if (item.type === "multiple") {
            // Movie Quiz
            return {
              ...baseQuestion,
              questionType: "movie",
            } as MovieQuizQuestion;
          } else if (item.image_url) {
            // 이미지 관련 퀴즈 (Photo-year 또는 Guess-who)
            if (questionType === "guess-who") {
              // Guess-who Quiz
              return {
                ...baseQuestion,
                questionType: "guess-who",
                imageUrls: Array.isArray(item.image_url)
                  ? item.image_url
                  : [item.image_url],
              } as GuessWhoQuizQuestion;
            } else {
              // Photo-year Quiz - 연도 관련 퀴즈
              return {
                ...baseQuestion,
                questionType: "photo-year",
                imageUrls: Array.isArray(item.image_url)
                  ? item.image_url
                  : [item.image_url],
              } as PhotoYearQuizQuestion;
            }
          }

          // 기본 값으로 Trivia Quiz 반환
          return {
            ...baseQuestion,
            questionType: "trivia",
          } as TriviaQuizQuestion;
        });

        setQuestions(formattedQuestions);
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
  }, [questionType, supabase]);

  // 컴포넌트 마운트 시와 의존성 변경 시 데이터 가져오기
  useEffect(() => {
    fetchQuizData();
  }, [questionType, fetchQuizData]);

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
