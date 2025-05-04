import type { NextApiRequest, NextApiResponse } from 'next';
import { GuessWhoQuestion } from '@/types';

type GuessWhoQuizData = {
  questions: GuessWhoQuestion[];
  timeLimit: number;
};

// Mock data for Guess-who quiz
const guessWhoQuestions: GuessWhoQuestion[] = [
  {
    id: 1,
    question: '이 인물은 누구일까요?',
    imagePaths: [
      '/images/guess-who/person1-1.jpg',
      '/images/guess-who/person1-2.jpg',
      '/images/guess-who/person1-3.jpg'
    ],
    correctAnswer: '짱구',
    options: ['짱구', '철수', '훈이', '맹구']
  },
  {
    id: 2,
    question: '이 인물은 누구일까요?',
    imagePaths: [
      '/images/guess-who/person2-1.jpg',
      '/images/guess-who/person2-2.jpg',
      '/images/guess-who/person2-3.jpg'
    ],
    correctAnswer: '유리',
    options: ['짱구', '유리', '훈이', '맹구']
  },
  {
    id: 3,
    question: '이 인물은 누구일까요?',
    imagePaths: [
      '/images/guess-who/person3-1.jpg',
      '/images/guess-who/person3-2.jpg',
      '/images/guess-who/person3-3.jpg'
    ],
    correctAnswer: '철수',
    options: ['짱구', '유리', '철수', '맹구']
  },
  {
    id: 4,
    question: '이 인물은 누구일까요?',
    imagePaths: [
      '/images/guess-who/person4-1.jpg',
      '/images/guess-who/person4-2.jpg',
      '/images/guess-who/person4-3.jpg'
    ],
    correctAnswer: '맹구',
    options: ['짱구', '유리', '훈이', '맹구']
  },
  {
    id: 5,
    question: '이 인물은 누구일까요?',
    imagePaths: [
      '/images/guess-who/person5-1.jpg',
      '/images/guess-who/person5-2.jpg',
      '/images/guess-who/person5-3.jpg'
    ],
    correctAnswer: '훈이',
    options: ['짱구', '유리', '훈이', '맹구']
  }
];

const GUESS_WHO_TIME_LIMIT = 20; // 문제당 20초

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GuessWhoQuizData>
) {
  // 나중에 Supabase 연동 시 실제 DB에서 데이터를 가져오도록 수정 예정
  res.status(200).json({
    questions: guessWhoQuestions,
    timeLimit: GUESS_WHO_TIME_LIMIT
  });
}
