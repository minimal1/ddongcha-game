export interface TriviaQuestion {
  id: string;
  question: string;
  answer: string;
  options?: string[];
}

export interface MovieQuestion {
  id: string;
  question: string;
  answer: string;
  options?: string[];
}

export interface PhotoYearQuestion {
  id: string;
  question: string;
  imageUrl: string;
  answer: string;
  options?: string[];
}

export interface GuessWhoQuestion {
  id: string;
  question: string;
  imageUrls: string[];
  answer: string;
  options?: string[];
}

export type Question = TriviaQuestion | MovieQuestion | PhotoYearQuestion | GuessWhoQuestion;

export type QuizType = 'trivia' | 'movie' | 'photo-year' | 'guess-who';
