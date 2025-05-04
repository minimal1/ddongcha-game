import { useState, useEffect } from "react";
import { getQuizById, updateQuiz, deleteQuiz } from "../api/quizAdminApi";
import {
  apiToFormValues,
  formToApiValues,
  QuizFormValues,
} from "./quizFormUtils";
import { deleteImagesOnly } from "./imageUtils";

/**
 * 퀴즈 상세 정보를 관리하는 훅
 *
 * @param uuid 퀴즈 UUID
 */
export const useQuizDetail = (uuid: string) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizFormValues>();
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);

  // 퀴즈 데이터 로드
  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getQuizById(uuid);

      if (!data) {
        setError("퀴즈를 찾을 수 없습니다.");
        return;
      }

      const formValues = apiToFormValues(data);
      setQuiz(formValues);

      // 원본 이미지 URL 저장 (이미지 변경 시 이전 이미지 삭제용)
      setOriginalImageUrls(formValues.imageUrls);
    } catch (err: any) {
      console.error("퀴즈 로드 오류:", err);
      setError(err.message || "퀴즈 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 퀴즈 업데이트
  const updateQuizData = async (formData: QuizFormValues) => {
    try {
      setSaving(true);
      setError(null);

      const apiData = formToApiValues(formData);
      await updateQuiz(uuid, apiData);

      // 업데이트 성공 시 퀴즈 데이터 갱신
      setQuiz(formData);

      // 이미지 URL이 변경된 경우 원본 이미지 목록 업데이트
      if (
        JSON.stringify(formData.imageUrls) !== JSON.stringify(originalImageUrls)
      ) {
        // 삭제된 이미지 찾기
        const deletedImages = originalImageUrls.filter(
          (url) => !formData.imageUrls.includes(url)
        );

        // 삭제된 이미지가 있으면서 퀴즈는 삭제하지 않은 경우 이미지만 삭제
        if (deletedImages.length > 0) {
          try {
            // 이미지만 삭제하는 유틸리티 함수 호출
            const deleteResult = await deleteImagesOnly(deletedImages);

            if (!deleteResult) {
              console.warn(
                "일부 이미지 삭제 실패, 하지만 퀴즈 업데이트는 성공"
              );
            }
          } catch (err) {
            console.error("이미지 삭제 오류:", err);
            // 이미지 삭제 실패는 퀴즈 업데이트에 영향 없음
          }
        }

        // 원본 이미지 목록 업데이트
        setOriginalImageUrls(formData.imageUrls);
      }

      return true;
    } catch (err: any) {
      console.error("퀴즈 업데이트 오류:", err);
      setError(err.message || "퀴즈 업데이트 중 오류가 발생했습니다.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // 퀴즈 삭제
  const deleteQuizData = async () => {
    try {
      setDeleting(true);
      setError(null);

      // 퀴즈와 관련 이미지 함께 삭제
      await deleteQuiz(uuid, originalImageUrls);

      return true;
    } catch (err: any) {
      console.error("퀴즈 삭제 오류:", err);
      setError(err.message || "퀴즈 삭제 중 오류가 발생했습니다.");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  // 컴포넌트 마운트 시 퀴즈 로드
  useEffect(() => {
    if (uuid) {
      loadQuiz();
    }
  }, [uuid]);

  return {
    quiz,
    setQuiz,
    loading,
    saving,
    deleting,
    error,
    updateQuiz: updateQuizData,
    deleteQuiz: deleteQuizData,
    refresh: loadQuiz,
  };
};
