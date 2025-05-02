import { NextPage } from 'next';
import Head from 'next/head';
import Dashboard from '@/components/Dashboard';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>레크리에이션 게임</title>
        <meta name="description" content="친구들과 함께하는 레크리에이션 게임 모음" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Dashboard />
      </main>
    </>
  );
};

export default Home;