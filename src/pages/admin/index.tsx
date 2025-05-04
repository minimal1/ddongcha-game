import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/features/admin/layout/AdminLayout';

/**
 * 관리자 대시보드/목록 페이지
 */
const AdminPage: React.FC = () => {
  return (
    <AdminLayout title="퀴즈 관리 대시보드">
      <Head>
        <title>퀴즈 관리자 페이지</title>
        <meta name="description" content="똥차지기 퀴즈 관리자 페이지" />
      </Head>
      
      {/* 이 부분은 추후 QuizList 컴포넌트로 대체될 예정 */}
      <div>
        <p>퀴즈 목록이 이곳에 표시됩니다.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;