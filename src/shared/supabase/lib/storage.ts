import { supabase } from "./supabase";

// 스토리지 버킷 이름 상수 정의
export const BUCKETS = {
  GAME_ASSETS: "game_assets",
};

// 이미지 업로드 함수
export const uploadImage = async (
  bucketName: string,
  filePath: string,
  file: File
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    throw error;
  }
};

// 이미지 URL 가져오기 함수
export const getImageUrl = (bucketName: string, path: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
};

// 이미지 삭제 함수
export const deleteImage = async (bucketName: string, filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("이미지 삭제 오류:", error);
    throw error;
  }
};

// 이미지 목록 가져오기 함수
export const listImages = async (bucketName: string, folderPath?: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath || "");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("이미지 목록 가져오기 오류:", error);
    throw error;
  }
};
