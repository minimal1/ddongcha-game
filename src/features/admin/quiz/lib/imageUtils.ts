import { deleteImage, BUCKETS } from '@/shared/supabase/lib/storage';

/**
 * URL에서 Supabase 파일 경로 추출
 * 
 * @param url Supabase Storage URL
 * @returns 파일 경로 또는 null (URL이 유효하지 않은 경우)
 */
export const extractFilePathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(
      /\/storage\/v1\/object\/public\/game_assets\/(.+)$/
    );
    
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1]);
    }
    
    return null;
  } catch (err) {
    console.error('URL 파싱 오류:', err);
    return null;
  }
};

/**
 * 특정 이미지 URL들만 삭제
 * 
 * @param imageUrls 삭제할 이미지 URL 배열
 * @returns 성공 여부
 */
export const deleteImagesOnly = async (imageUrls: string[]): Promise<boolean> => {
  if (!imageUrls || imageUrls.length === 0) {
    return true;
  }
  
  try {
    const deletePromises = imageUrls.map(async (url) => {
      const filePath = extractFilePathFromUrl(url);
      
      if (filePath) {
        try {
          await deleteImage(BUCKETS.GAME_ASSETS, filePath);
          console.log(`이미지 삭제 성공: ${filePath}`);
          return true;
        } catch (err) {
          console.error(`이미지 삭제 실패: ${filePath}`, err);
          return false;
        }
      }
      
      return false;
    });
    
    const results = await Promise.all(deletePromises);
    
    // 모든 이미지가 성공적으로 삭제되었는지 확인
    return results.every(result => result);
  } catch (err) {
    console.error('이미지 삭제 오류:', err);
    return false;
  }
};