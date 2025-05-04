import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseContext } from '@/shared/supabase/lib/SupabaseProvider';
import styles from './AdminHeader.module.css';

/**
 * 관리자 헤더 컴포넌트
 * 
 * 상단 네비게이션과 로그아웃 기능을 제공합니다.
 */
const AdminHeader: React.FC = () => {
  const router = useRouter();
  const { supabase } = useSupabaseContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 현재 페이지 경로에 따라 활성 메뉴 표시
  const isActive = (path: string) => router.pathname === path;

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/admin">
            퀴즈 관리자
          </Link>
        </div>

        {/* 데스크톱 메뉴 */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            <li className={`${styles.navItem} ${isActive('/admin') ? styles.active : ''}`}>
              <Link href="/admin">
                퀴즈 목록
              </Link>
            </li>
            <li className={`${styles.navItem} ${isActive('/admin/create') ? styles.active : ''}`}>
              <Link href="/admin/create">
                퀴즈 생성
              </Link>
            </li>
            <li className={styles.navItem}>
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                로그아웃
              </button>
            </li>
          </ul>
        </nav>

        {/* 모바일 메뉴 토글 버튼 */}
        <button 
          className={styles.mobileMenuButton} 
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
        >
          <span className={styles.hamburger}></span>
        </button>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList}>
              <li className={`${styles.mobileNavItem} ${isActive('/admin') ? styles.active : ''}`}>
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  퀴즈 목록
                </Link>
              </li>
              <li className={`${styles.mobileNavItem} ${isActive('/admin/create') ? styles.active : ''}`}>
                <Link href="/admin/create" onClick={() => setMobileMenuOpen(false)}>
                  퀴즈 생성
                </Link>
              </li>
              <li className={styles.mobileNavItem}>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className={styles.mobileLogoutButton}
                >
                  로그아웃
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;