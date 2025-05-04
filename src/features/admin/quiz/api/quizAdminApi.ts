import { QuizRequest } from "../model/quiz-request.model";
import { supabase, TABLES } from "@/shared/supabase/lib/supabase";
import { BUCKETS, deleteImage } from "@/shared/supabase/lib/storage";

/**
 * 퀴즈 목록 조회
 *
 * @param questionType 특정 퀴즈 유형으로 필터링 (선택사항)
 * @param page 페이지 번호
 * @param limit 페이지당 아이템 수
 * @returns 퀴즈 목록과 총 개수
 */
export const getQuizList = async ({
  questionType,
  page = 1,
  limit = 50,
}: {
  questionType?: string;
  page: number;
  limit: number;
}) => {
  try {
    let query = supabase.from(TABLES.QUESTIONS).select("*", { count: "exact" });

    // 퀴즈 타입 필터링
    if (questionType) {
      query = query.eq("question_type", questionType);
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    query = query.range(startIndex, startIndex + limit - 1);

    // 최신순 정렬
    query = query.order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      quizzes: data || [],
      total: count || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("퀴즈 목록 조회 오류:", error);
    throw error;
  }
};

/**
 * 단일 퀴즈 조회
 *
 * @param uuid 퀴즈 UUID
 * @returns 퀴즈 데이터
 */
export const getQuizById = async (uuid: string) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.QUESTIONS)
      .select("*")
      .eq("uuid", uuid)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("퀴즈 조회 오류:", error);
    throw error;
  }
};

/**
 * 퀴즈 생성
 *
 * @param quiz 생성할 퀴즈 데이터
 * @returns 생성된 퀴즈 데이터
 */
export const createQuiz = async (quiz: QuizRequest) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.QUESTIONS)
      .insert([quiz])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("퀴즈 생성 오류:", error);
    throw error;
  }
};

/**
 * 퀴즈 수정
 *
 * @param uuid 퀴즈 UUID
 * @param quiz 수정할 퀴즈 데이터
 * @returns 수정된 퀴즈 데이터
 */
export const updateQuiz = async (uuid: string, quiz: QuizRequest) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.QUESTIONS)
      .update(quiz)
      .eq("uuid", uuid)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("퀴즈 수정 오류:", error);
    throw error;
  }
};

/**
 * 퀴즈 삭제
 *
 * @param uuid 퀴즈 UUID
 * @param imageUrls 삭제할 이미지 URL 배열 (선택사항)
 * @returns 성공 여부
 */
export const deleteQuiz = async (uuid: string, imageUrls?: string[]) => {
  try {
    // 1. 관련 이미지가 있으면 스토리지에서 삭제
    if (imageUrls && imageUrls.length > 0) {
      await Promise.all(
        imageUrls.map(async (url) => {
          try {
            // URL에서 파일 경로 추출
            const urlObj = new URL(url);
            const pathMatch = urlObj.pathname.match(
              /\/storage\/v1\/object\/public\/game_assets\/(.+)$/
            );

            if (pathMatch && pathMatch[1]) {
              const filePath = decodeURIComponent(pathMatch[1]);
              await deleteImage(BUCKETS.GAME_ASSETS, filePath);
            }
          } catch (err) {
            console.error("이미지 삭제 실패:", url, err);
            // 이미지 삭제 실패해도 계속 진행
          }
        })
      );
    }

    // 2. 퀴즈 데이터 삭제
    const { error } = await supabase
      .from(TABLES.QUESTIONS)
      .delete()
      .eq("uuid", uuid);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("퀴즈 삭제 오류:", error);
    throw error;
  }
};
