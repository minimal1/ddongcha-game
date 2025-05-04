import React from 'react';
import Head from 'next/head';
import AdminAuthGuard from '@/features/admin/auth/ui/AdminAuthGuard';


/**
 * 관리자 대시보드 페이지
 */
const AdminPage: React.FC = () => {
  return (
    <AdminAuthGuard>
      <Head>
        <title>게임 관리자 페이지</title>
        <meta name="description" content="레크리에이션 게임 관리자 페이지" />
      </Head>

    </AdminAuthGuard>
  );
};

export default AdminPage;
