import React from 'react';
import AdminHeader from './AdminHeader';
import AdminAuthGuard from '../auth/ui/AdminAuthGuard';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * 관리자 레이아웃 컴포넌트
 * 
 * AdminHeader와 AdminAuthGuard를 포함한 기본 레이아웃 구조를 제공합니다.
 * 모든 관리자 페이지에서 공통으로 사용됩니다.
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  return (
    <AdminAuthGuard>
      <div className={styles.adminLayout}>
        <AdminHeader />
        <main className={styles.mainContent}>
          {title && <h1 className={styles.pageTitle}>{title}</h1>}
          <div className={styles.contentContainer}>
            {children}
          </div>
        </main>
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>© 2025 퀴즈 관리자 시스템</p>
          </div>
        </footer>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminLayout;