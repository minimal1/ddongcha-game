import type { NextApiRequest, NextApiResponse } from 'next';

type PhotoYearQuestion = {
  id: number;
  imagePath: string;
  minYear: number;
  maxYear: number;
  correctAnswer: number;
  options: number[];
};

type PhotoYearQuizData = {
  questions: PhotoYearQuestion[];
  timeLimit: number;
};

// Mock data for photo year quiz
const photoYearQuestions: PhotoYearQuestion[] = [
  {
    id: 1,
    imagePath: '/images/photos/photo1.jpg',
    minYear: 2010,
    maxYear: 2020,
    correctAnswer: 2015,
    options: [2011, 2013, 2015, 2018]
  },
  {
    id: 2,
    imagePath: '/images/photos/photo2.jpg', 
    minYear: 2005,
    maxYear: 2015,
    correctAnswer: 2010,
    options: [2005, 2007, 2010, 2012]
  },
  {
    id: 3,
    imagePath: '/images/photos/photo3.jpg',
    minYear: 2000,
    maxYear: 2010,
    correctAnswer: 2008,
    options: [2000, 2004, 2008, 2010]
  },
  {
    id: 4,
    imagePath: '/images/photos/photo4.jpg',
    minYear: 2010,
    maxYear: 2020,
    correctAnswer: 2013,
    options: [2010, 2013, 2016, 2019]
  },
  {
    id: 5,
    imagePath: '/images/photos/photo5.jpg',
    minYear: 2005,
    maxYear: 2015,
    correctAnswer: 2012,
    options: [2005, 2008, 2012, 2015]
  },
  {
    id: 6,
    imagePath: '/images/photos/photo6.jpg',
    minYear: 2015,
    maxYear: 2022,
    correctAnswer: 2019,
    options: [2015, 2017, 2019, 2021]
  }
];

const PHOTO_YEAR_TIME_LIMIT = 20; // 문제당 20초

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PhotoYearQuizData>
) {
  res.status(200).json({
    questions: photoYearQuestions,
    timeLimit: PHOTO_YEAR_TIME_LIMIT
  });
}