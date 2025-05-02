import type { NextApiRequest, NextApiResponse } from 'next';

type TriviaQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

type TriviaQuizData = {
  questions: TriviaQuestion[];
  timeLimit: number;
};

// Mock data for trivia quiz
const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: '세계에서 가장 큰 대륙은?',
    options: ['아시아', '아프리카', '북아메리카', '유럽'],
    correctAnswer: '아시아'
  },
  {
    id: 2,
    question: '물의 끓는점은 몇 도?',
    options: ['90°C', '100°C', '110°C', '120°C'],
    correctAnswer: '100°C'
  },
  {
    id: 3,
    question: '한국의 수도는?',
    options: ['서울', '부산', '인천', '대전'],
    correctAnswer: '서울'
  },
  {
    id: 4,
    question: '태양계에서 가장 큰 행성은?',
    options: ['지구', '화성', '목성', '토성'],
    correctAnswer: '목성'
  },
  {
    id: 5,
    question: '세계에서 가장 높은 산은?',
    options: ['에베레스트', 'K2', '킬리만자로', '매킨리'],
    correctAnswer: '에베레스트'
  },
  {
    id: 6,
    question: '인체에서 가장 큰 장기는?',
    options: ['심장', '폐', '간', '뇌'],
    correctAnswer: '간'
  },
  {
    id: 7,
    question: '전 세계에서 사용자가 가장 많은 소셜 미디어 플랫폼은?',
    options: ['페이스북', '인스타그램', '틱톡', '트위터'],
    correctAnswer: '페이스북'
  },
  {
    id: 8,
    question: '모나리자를 그린 예술가는?',
    options: ['레오나르도 다 빈치', '미켈란젤로', '라파엘로', '반 고흐'],
    correctAnswer: '레오나르도 다 빈치'
  },
  {
    id: 9,
    question: '세계에서 인구가 가장 많은 국가는?',
    options: ['중국', '인도', '미국', '인도네시아'],
    correctAnswer: '인도'
  },
  {
    id: 10,
    question: '인간의 DNA는 몇 개의 염색체로 구성되어 있나?',
    options: ['23쌍', '24쌍', '22쌍', '21쌍'],
    correctAnswer: '23쌍'
  }
];

const TRIVIA_TIME_LIMIT = 15; // 문제당 15초

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TriviaQuizData>
) {
  res.status(200).json({
    questions: triviaQuestions,
    timeLimit: TRIVIA_TIME_LIMIT
  });
}