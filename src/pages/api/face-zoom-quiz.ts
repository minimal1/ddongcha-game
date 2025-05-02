import type { NextApiRequest, NextApiResponse } from 'next';

type FaceZoomQuestion = {
  id: number;
  imagePath: string;
  zoomLevels: number;
  correctAnswer: string;
  options: string[];
};

type FaceZoomQuizData = {
  questions: FaceZoomQuestion[];
  timeLimit: number;
  zoomInterval: number;
};

// Mock data for face zoom quiz
const faceZoomQuestions: FaceZoomQuestion[] = [
  {
    id: 1,
    imagePath: '/images/faces/face1.jpg',
    zoomLevels: 5,
    correctAnswer: '김철수',
    options: ['김철수', '이영희', '박지성', '최민수']
  },
  {
    id: 2,
    imagePath: '/images/faces/face2.jpg',
    zoomLevels: 5,
    correctAnswer: '이영희',
    options: ['김철수', '이영희', '박지성', '최민수']
  },
  {
    id: 3,
    imagePath: '/images/faces/face3.jpg',
    zoomLevels: 5,
    correctAnswer: '박지성',
    options: ['김철수', '이영희', '박지성', '최민수']
  },
  {
    id: 4,
    imagePath: '/images/faces/face4.jpg',
    zoomLevels: 5,
    correctAnswer: '최민수',
    options: ['김철수', '이영희', '박지성', '최민수']
  },
  {
    id: 5,
    imagePath: '/images/faces/face5.jpg',
    zoomLevels: 5,
    correctAnswer: '정소희',
    options: ['정소희', '김동현', '이지은', '강민호']
  },
  {
    id: 6,
    imagePath: '/images/faces/face6.jpg',
    zoomLevels: 5,
    correctAnswer: '김동현',
    options: ['정소희', '김동현', '이지은', '강민호']
  }
];

const FACE_ZOOM_TIME_LIMIT = 25; // 문제당 25초
const ZOOM_INTERVAL = 5; // 5초마다 얼굴 줌 아웃

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<FaceZoomQuizData>
) {
  res.status(200).json({
    questions: faceZoomQuestions,
    timeLimit: FACE_ZOOM_TIME_LIMIT,
    zoomInterval: ZOOM_INTERVAL
  });
}