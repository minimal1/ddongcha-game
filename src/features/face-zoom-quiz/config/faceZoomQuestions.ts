import { FaceZoomQuestion } from 'shared/lib/types';

// 얼굴 줌 아웃 퀴즈 문제 목록
export const faceZoomQuestions: FaceZoomQuestion[] = [
  {
    id: 1,
    imagePath: '/images/faces/face1.jpg', // 실제 이미지는 public/images/faces/ 디렉토리에 위치
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
  },
  {
    id: 7,
    imagePath: '/images/faces/face7.jpg',
    zoomLevels: 5,
    correctAnswer: '이지은',
    options: ['정소희', '김동현', '이지은', '강민호']
  },
  {
    id: 8,
    imagePath: '/images/faces/face8.jpg',
    zoomLevels: 5,
    correctAnswer: '강민호',
    options: ['정소희', '김동현', '이지은', '강민호']
  }
];

// 게임 기본 설정
export const FACE_ZOOM_TIME_LIMIT = 25; // 문제당 25초
export const ZOOM_INTERVAL = 5; // 5초마다 얼굴 줌 아웃