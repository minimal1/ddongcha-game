import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * 관리자 페이지 레이아웃 컴포넌트
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange 
}) => {
  // 탭 메뉴 항목 정의
  const tabs = [
    { id: 'dashboard', label: '대시보드' },
    { id: 'questions', label: '문항 관리' },
    { id: 'sessions', label: '게임 세션 관리' }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">
            <h1>레크리에이션 게임 관리</h1>
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.tabList}>
            {tabs.map((tab) => (
              <li key={tab.id} className={styles.tabItem}>
                <button
                  className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
          <Link href="/host" className={styles.hostButton}>
            게임 진행 화면으로
          </Link>
        </div>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} 레크리에이션 게임 관리자</p>
      </footer>
    </div>
  );
};

export default AdminLayout;
