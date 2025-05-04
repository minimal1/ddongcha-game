import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/features/admin/layout/AdminLayout';
import QuizList from '@/features/admin/quiz/ui/QuizList';

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
      
      <QuizList />
    </AdminLayout>
  );
};

export default AdminPage;