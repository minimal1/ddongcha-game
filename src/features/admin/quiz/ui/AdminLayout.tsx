import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from './AdminLayout.module.css';
import LogoutButton from '@/features/admin/auth/ui/LogoutButton';
import { useSupabaseContext } from '@/shared/supabase/lib/SupabaseProvider';

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
  const { user } = useSupabaseContext();
  
  // 탭 메뉴 정의
  const tabs = [
    { id: 'questions', label: '문제 관리' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">
            <h1>똥차게임 관리자</h1>
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
          {user && (
            <div className={styles.userInfo}>
              <span className={styles.userEmail}>{user.email}</span>
              <LogoutButton />
            </div>
          )}
        </div>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} 똥차게임 관리자</p>
      </footer>
    </div>
  );
};

export default AdminLayout;