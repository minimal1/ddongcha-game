-- Supabase 스키마 업데이트 SQL - Guess-who 퀴즈 지원

-- 이미 game_questions 테이블이 있으므로 별도 추가하지 않고, 
-- 기존 테이블을 활용합니다. 기존 테이블 구조:
-- id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
-- title TEXT NOT NULL,
-- content TEXT NOT NULL,
-- type TEXT NOT NULL CHECK (type IN ('single', 'multiple', 'text')),
-- options JSONB, -- 선택형 문제를 위한 선택지
-- answer TEXT, -- 주관식/객관식 문제를 위한 정답
-- image_url TEXT,
-- time_limit INTEGER, -- 초 단위, 기본값은 설정에서 가져옴
-- points INTEGER DEFAULT 1, -- 문제 점수, 기본값 1
-- hint TEXT,
-- explanation TEXT,
-- tags TEXT[],
-- difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
-- created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
-- updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()

-- Guess-who 퀴즈 유형은 다중 이미지를 필요로 하므로 관련 필드 추가
ALTER TABLE game_questions ADD COLUMN IF NOT EXISTS image_urls TEXT[]; -- 다중 이미지 URL 저장용

-- Guess-who 퀴즈 유형 식별을 위한 enum 값 추가 (기존 type에 'guess-who' 추가)
ALTER TABLE game_questions DROP CONSTRAINT IF EXISTS game_questions_type_check;
ALTER TABLE game_questions ADD CONSTRAINT game_questions_type_check 
  CHECK (type IN ('single', 'multiple', 'text', 'trivia', 'movie', 'photo-year', 'guess-who'));

-- 스토리지 버킷 확인 (이미 생성되어 있는지)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'quiz_images') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('quiz_images', 'quiz_images', true);
  END IF;
END
$$;

-- 이미지 접근 정책 설정
-- 모든 읽기 접근 허용
CREATE POLICY IF NOT EXISTS "Anyone can read quiz images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'quiz_images');

-- 업로드 접근 허용 (관리자 페이지에서 사용)
CREATE POLICY IF NOT EXISTS "Anyone can upload quiz images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'quiz_images');

-- Guess-who 예시 데이터 추가
INSERT INTO game_questions (title, content, type, image_urls, answer, difficulty)
VALUES 
  ('알아맞춰보세요', '이 인물은 누구일까요?', 'guess-who', 
   ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
   '짱구', 'medium');
