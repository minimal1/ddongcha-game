import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './shared/ui/Dashboard';
import './App.css';

// 게임 컴포넌트 임포트
import TriviaQuiz from './features/game1/ui/TriviaQuiz';
import MovieQuiz from './features/game2/ui/MovieQuiz';
import FaceZoomQuiz from './features/game3/ui/FaceZoomQuiz';
import PhotoYearQuiz from './features/game4/ui/PhotoYearQuiz';

const App: React.FC = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trivia" element={<TriviaQuiz />} />
        <Route path="/movie" element={<MovieQuiz />} />
        <Route path="/face-zoom" element={<FaceZoomQuiz />} />
        <Route path="/photo-year" element={<PhotoYearQuiz />} />
      </Routes>
    </div>
  );
};

export default App;