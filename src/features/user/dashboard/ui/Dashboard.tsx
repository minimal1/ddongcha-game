import React from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const games = [
    {
      id: 'trivia',
      title: '상식 퀴즈 배틀',
      description: '다양한 분야의 상식 문제를 푸는 퀴즈 게임입니다.',
      icon: '🧠'
    },
    {
      id: 'movie',
      title: '영화제목, 대사 맞추기',
      description: '유명 영화의 제목과 대사를 맞추는 게임입니다.',
      icon: '🎬'
    },
    {
      id: 'guess-who',
      title: '추억 사진 퀴즈 - 얼굴 맞추기',
      description: '확대된 얼굴 사진을 보고 누구인지 맞추는 게임입니다.',
      icon: '🔍'
    },
    {
      id: 'photo-year',
      title: '추억 사진 퀴즈 - 촬영 연도',
      description: '단체 사진의 촬영 연도를 맞추는 게임입니다.',
      icon: '📅'
    }
  ];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>레크리에이션 게임</h1>
      <p className={styles.subtitle}>즐길 게임을 선택하세요!</p>
      
      <div className={styles.gamesGrid}>
        {games.map(game => (
          <Link href={`/${game.id}`} className={styles.gameCard} key={game.id}>
            <div className={styles.gameIcon}>{game.icon}</div>
            <h2 className={styles.gameTitle}>{game.title}</h2>
            <p className={styles.gameDescription}>{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;