import React, { useState, useRef } from 'react';
import { uploadImage, getImageUrl, BUCKETS } from '@/shared/config/storage';
import styles from './FileUploader.module.css';

interface FileUploaderProps {
  onFileUploaded: (url: string) => void;
  currentUrl?: string;
  bucket?: string;
  filePathPrefix?: string;
}

/**
 * 파일 업로드 컴포넌트
 */
const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  currentUrl = '',
  bucket = BUCKETS.GAME_ASSETS,
  filePathPrefix = 'questions/'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 파일 선택 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // 파일 타입 검증 (이미지만 허용)
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    // 파일 크기 검증 (5MB 이하)
    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      setProgress(0);
      
      // 프리뷰 URL 생성
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
      
      // 파일명 생성 (중복 방지를 위해 타임스탬프 추가)
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${filePathPrefix}${timestamp}.${fileExtension}`;
      
      // Mock 업로드 진행률 업데이트 (실제로는 Supabase가 진행률을 제공하지 않음)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);
      
      // Supabase Storage에 업로드
      const data = await uploadImage(bucket, fileName, file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (!data) throw new Error('업로드 실패');
      
      // 이미지 URL 가져오기
      const imageUrl = getImageUrl(bucket, fileName);
      
      // 부모 컴포넌트에 URL 전달
      onFileUploaded(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 업로드 중 오류가 발생했습니다.');
      console.error('File upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };
  
  // 파일 선택 버튼 클릭 핸들러
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    setPreviewUrl('');
    onFileUploaded('');
    
    // 파일 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={styles.fileUploader}>
      <input
        type="file"
        ref={fileInputRef}
        className={styles.fileInput}
        onChange={handleFileChange}
        accept="image/*"
        disabled={isUploading}
      />
      
      {previewUrl ? (
        <div className={styles.preview}>
          <img
            src={previewUrl}
            alt="Preview"
            className={styles.previewImage}
          />
          
          <div className={styles.previewActions}>
            <button
              type="button"
              onClick={handleSelectFile}
              className={styles.changeButton}
              disabled={isUploading}
            >
              이미지 변경
            </button>
            
            <button
              type="button"
              onClick={handleRemoveImage}
              className={styles.removeButton}
              disabled={isUploading}
            >
              이미지 제거
            </button>
          </div>
        </div>
      ) : (
        <div
          className={styles.dropzone}
          onClick={handleSelectFile}
        >
          <div className={styles.dropzoneContent}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.uploadIcon}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>이미지를 업로드하려면 클릭하거나 드래그하세요</p>
            <span>PNG, JPG, GIF (최대 5MB)</span>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span>{progress}% 업로드 중...</span>
        </div>
      )}
      
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
