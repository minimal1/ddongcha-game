-- Supabase 스키마 생성 SQL
-- 이 파일은 Supabase SQL 에디터에서 실행하여 필요한 테이블을 생성합니다.

-- 게임 질문 테이블
CREATE TABLE game_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('single', 'multiple', 'text')),
  options JSONB, -- 객관식 문제를 위한 선택지
  answer TEXT, -- 주관식/단일 선택 문제를 위한 정답
  image_url TEXT,
  time_limit INTEGER, -- 초 단위, 기본값은 전역 설정에서 가져옴
  points INTEGER DEFAULT 1, -- 문제 점수, 기본값 1
  hint TEXT,
  explanation TEXT,
  tags TEXT[],
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 게임 세션 테이블
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  host_id UUID NOT NULL,
  state TEXT NOT NULL DEFAULT 'waiting' CHECK (state IN ('waiting', 'question', 'result', 'ended')),
  current_question_id UUID REFERENCES game_questions(id),
  current_question_index INTEGER,
  questions UUID[] NOT NULL, -- 문제 ID 목록
  settings JSONB NOT NULL DEFAULT '{"allowLateJoin": true, "questionTimer": 30, "randomizeQuestions": false, "showResultsAfterEach": true, "countdownBeforeQuestion": 3}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 플레이어 테이블
CREATE TABLE game_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
  avatar_url TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 플레이어 답변 테이블
CREATE TABLE player_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES game_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time INTEGER NOT NULL, -- 응답 시간(밀리초)
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (game_id, player_id, question_id) -- 한 플레이어가 한 문제에 대해 하나의 답변만 가능
);

-- RLS(Row Level Security) 정책 설정
-- 실제 애플리케이션에서는 보안을 위해 RLS 정책을 구성해야 합니다.
-- 아래는 예시이며, 실제 요구사항에 맞게 조정이 필요합니다.

-- 모든 테이블에 RLS 활성화
ALTER TABLE game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_answers ENABLE ROW LEVEL SECURITY;

-- 익명 사용자가 게임 세션 읽기 가능
CREATE POLICY "Anyone can read game sessions"
  ON game_sessions FOR SELECT
  USING (true);

-- 익명 사용자가 게임 문제 읽기 가능
CREATE POLICY "Anyone can read game questions"
  ON game_questions FOR SELECT
  USING (true);

-- 익명 사용자가 플레이어 읽기 가능
CREATE POLICY "Anyone can read players"
  ON game_players FOR SELECT
  USING (true);

-- 익명 사용자가 플레이어 생성 가능
CREATE POLICY "Anyone can create players"
  ON game_players FOR INSERT
  WITH CHECK (true);

-- 익명 사용자가 자신의 플레이어 데이터 업데이트 가능
CREATE POLICY "Players can update their own data"
  ON game_players FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 익명 사용자가 답변 읽기 가능
CREATE POLICY "Anyone can read answers"
  ON player_answers FOR SELECT
  USING (true);

-- 익명 사용자가 답변 생성 가능
CREATE POLICY "Anyone can create answers"
  ON player_answers FOR INSERT
  WITH CHECK (true);

-- 스토리지 버킷 생성
-- 스토리지 기능 사용을 위한 버킷 생성
INSERT INTO storage.buckets (id, name, public) VALUES ('game_assets', 'game_assets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('profile_images', 'profile_images', true);

-- 스토리지 정책 설정
-- 파일 읽기 정책
CREATE POLICY "Anyone can read game assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'game_assets');

CREATE POLICY "Anyone can read profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile_images');

-- 파일 업로드 정책
CREATE POLICY "Anyone can upload game assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'game_assets');

CREATE POLICY "Anyone can upload profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile_images');

-- 샘플 데이터 추가
-- 예시 질문 데이터
INSERT INTO game_questions (title, content, type, answer, difficulty)
VALUES 
  ('우리나라의 수도는?', '대한민국의 수도인 도시 이름은 무엇인가요?', 'text', '서울', 'easy'),
  ('다음 중 포유류가 아닌 것은?', '다음 동물 중 포유류가 아닌 것을 고르세요.', 'multiple', '3', 'medium');

-- 첫 번째 질문에는 텍스트 답변, 두 번째 질문에는 객관식 답변 옵션 추가
UPDATE game_questions 
SET options = '[
  {"id": "1", "text": "고양이", "isCorrect": false},
  {"id": "2", "text": "코끼리", "isCorrect": false},
  {"id": "3", "text": "악어", "isCorrect": true},
  {"id": "4", "text": "곰", "isCorrect": false}
]'::jsonb
WHERE title = '다음 중 포유류가 아닌 것은?';
