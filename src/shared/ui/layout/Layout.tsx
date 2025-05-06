import React, { ReactNode, useEffect, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // 테마 변경 함수
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // 테마를 localStorage에 저장
    localStorage.setItem('theme', newTheme);
    // HTML 요소에 테마 클래스 적용
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  // 초기 로드시 저장된 테마 적용
  useEffect(() => {
    // localStorage에서 테마 정보 가져오기
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    
    // HTML 요소에 테마 클래스 적용
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, []);

  return (
    <div className="app">
      {children}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default Layout;
