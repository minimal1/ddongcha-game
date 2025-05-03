# 똥차게임 인증 설정 가이드

이 문서는 똥차게임 애플리케이션의 인증 시스템 설정 방법을 설명합니다.

## Supabase 설정

1. [Supabase](https://supabase.com)에 회원가입 후 새 프로젝트를 생성합니다.

2. 프로젝트 생성 후 `Settings` -> `API` 메뉴에서 다음 정보를 가져옵니다:
   - **Project URL**: `.env.local` 파일의 `NEXT_PUBLIC_SUPABASE_URL` 값으로 설정
   - **anon public key**: `.env.local` 파일의 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 값으로 설정

3. `Authentication` -> `Providers` 메뉴에서 이메일/비밀번호 인증을 활성화합니다:
   - `Email` 탭에서 `Enable Email Sign In` 옵션을 활성화
   - 필요한 경우 `Enable Email Confirmations` 옵션을 비활성화 (개발 환경용)

## 관리자 계정 설정

1. Supabase 대시보드의 `Authentication` -> `Users` 메뉴에서 `Invite User` 버튼을 클릭합니다.

2. 관리자 이메일 주소와 초기 비밀번호를 입력하여 관리자 계정을 생성합니다.

3. (선택 사항) SQL Editor에서 다음 쿼리를 실행하여 관리자 권한 테이블을 생성할 수 있습니다:

```sql
-- 관리자 권한 테이블 생성
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS(Row Level Security) 정책 설정
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 읽기 정책: 인증된 사용자만 읽기 가능
CREATE POLICY "Admins are viewable by authenticated users" 
ON admins FOR SELECT 
USING (auth.role() = 'authenticated');

-- 추가 정책: 관리자만 관리자 추가 가능
CREATE POLICY "Only admins can insert new admins" 
ON admins FOR INSERT 
USING (
  auth.uid() IN (SELECT user_id FROM admins)
);

-- 사용자 ID를 기반으로 관리자 추가 (첫 관리자 계정)
INSERT INTO admins (user_id) 
VALUES ('관리자_사용자_UUID_여기에_입력');
```

## 환경 변수 설정

1. 루트 디렉토리에 `.env.local` 파일을 생성합니다.

2. `.env.local.example` 파일을 참고하여 다음 변수들을 설정합니다:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. 프로젝트를 재시작하여 환경 변수를 적용합니다.

## 테스트

1. 애플리케이션을 실행한 후 `/login` 페이지로 이동합니다.

2. Supabase에서 생성한 관리자 계정으로 로그인합니다.

3. 로그인 성공 시 `/admin` 페이지로 자동 리디렉션됩니다.

## 추가 보안 고려사항

1. 실제 운영 환경에서는 보안 강화를 위해 다음 설정을 고려하세요:
   - 비밀번호 복잡성 요구사항 설정
   - 이메일 확인 활성화
   - 다단계 인증(MFA) 설정
   - JWT 토큰 만료 시간 조정

2. RLS(Row Level Security) 정책을 적절히 설정하여 데이터 접근 권한을 제어하세요.

3. 관리자 계정의 비밀번호는 주기적으로 변경하는 것이 좋습니다.