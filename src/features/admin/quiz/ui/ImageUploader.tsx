import React, { useState, useRef, useCallback, useEffect } from 'react';
import { uploadImage, getImageUrl, deleteImage, BUCKETS } from '@/shared/supabase/lib/storage';
import { QuestionType } from '@/entities/shared/quiz/model/question-type.model';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  questionType: QuestionType;
  initialImages?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

/**
 * 이미지 업로드 컴포넌트
 * 
 * 퀴즈 생성/수정 시 이미지 업로드를 담당합니다.
 * - 단일 또는 다중 이미지 업로드 지원
 * - 드래그 앤 드롭 지원
 * - 이미지 미리보기 및 삭제 기능
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  questionType,
  initialImages = [],
  onChange,
  maxImages = 1,
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 초기 이미지 설정
  useEffect(() => {
    setImageUrls(initialImages);
  }, [initialImages]);

  // 이미지 URL 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onChange(imageUrls);
  }, [imageUrls, onChange]);

  // 이미지 경로 생성 함수
  const generateImagePath = (file: File, index: number): string => {
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop() || 'png';
    return `quizzes/${questionType}/${timestamp}-${index}.${fileExt}`;
  };

  // 이미지 업로드 처리
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // 최대 이미지 개수 확인
    if (imageUrls.length + files.length > maxImages) {
      setError(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // 이미지 파일 형식 확인
        if (!file.type.startsWith('image/')) {
          throw new Error('이미지 파일만 업로드할 수 있습니다.');
        }

        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
        }

        const filePath = generateImagePath(file, imageUrls.length + index);
        await uploadImage(BUCKETS.GAME_ASSETS, filePath, file);
        return getImageUrl(BUCKETS.GAME_ASSETS, filePath);
      });

      const newUrls = await Promise.all(uploadPromises);
      setImageUrls((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      console.error('이미지 업로드 오류:', err);
      setError(err.message || '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 파일 입력 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files);
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = async (index: number) => {
    try {
      const urlToRemove = imageUrls[index];
      
      // URL에서 파일 경로 추출
      const urlObj = new URL(urlToRemove);
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/game_assets\/(.+)$/);
      
      if (pathMatch && pathMatch[1]) {
        const filePath = decodeURIComponent(pathMatch[1]);
        await deleteImage(BUCKETS.GAME_ASSETS, filePath);
      }

      // 상태 업데이트
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
    } catch (err: any) {
      console.error('이미지 삭제 오류:', err);
      setError(err.message || '이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  // 드래그 이벤트 핸들러
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // 드롭 이벤트 핸들러
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.dropzone} ${dragActive ? styles.active : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          multiple={maxImages > 1}
          className={styles.fileInput}
        />
        
        <div className={styles.placeholder}>
          <svg className={styles.uploadIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p>
            {dragActive 
              ? '여기에 파일을 놓으세요' 
              : `이미지를 드래그하거나 클릭하여 업로드하세요${maxImages > 1 ? ` (최대 ${maxImages}개)` : ''}`
            }
          </p>
          <button 
            type="button" 
            onClick={handleSelectClick} 
            className={styles.selectButton}
            disabled={uploading}
          >
            파일 선택
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {uploading && (
        <div className={styles.uploading}>
          <div className={styles.spinner}></div>
          <p>업로드 중...</p>
        </div>
      )}

      {imageUrls.length > 0 && (
        <div className={styles.previewContainer}>
          {imageUrls.map((url, index) => (
            <div key={index} className={styles.previewItem}>
              <img src={url} alt={`미리보기 ${index + 1}`} className={styles.previewImage} />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className={styles.removeButton}
                aria-label="이미지 삭제"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;