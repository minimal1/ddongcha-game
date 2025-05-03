import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/features/admin/ui/AdminLayout';
import QuestionList from '@/features/admin/ui/QuestionList';
import GameSessionList from '@/features/admin/ui/GameSessionList';
import AdminDashboard from '@/features/admin/ui/AdminDashboard';

type AdminTab = 'dashboard' | 'questions' | 'sessions';

/**
 * 관리자 대시보드 페이지
 */
const AdminPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // 현재 활성 탭에 따른 컴포넌트 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'questions':
        return <QuestionList />;
      case 'sessions':
        return <GameSessionList />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <>
      <Head>
        <title>게임 관리자 페이지</title>
        <meta name="description" content="레크리에이션 게임 관리자 페이지" />
      </Head>

      <AdminLayout 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as AdminTab)}
      >
        {renderTabContent()}
      </AdminLayout>
    </>
  );
};

export default AdminPage;
