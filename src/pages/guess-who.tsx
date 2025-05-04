import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import QuizLayout from '@/components/quiz/QuizLayout';
import { useQuiz, QuizState } from '@/hooks/useQuiz';
import { useQuizData } from '@/hooks/useQuizData';
import { GuessWhoQuestion } from '@/types';
import styles from '@/styles/components/quiz/GuessWhoQuiz.module.css';

const GuessWhoQuizPage: NextPage = () => {
  // API에서 퀴즈 데이터 가져오기
  const { questions, timeLimit, loading, error } = useQuizData<GuessWhoQuestion>({
    apiEndpoint: 'guess-who-quiz'
  });

  // 현재 표시할 이미지 인덱스
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 퀴즈 상태 관리
  const {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    timeRemaining,
    startQuiz,
    showAnswer,
    nextQuestion,
    resetQuiz
  } = useQuiz<GuessWhoQuestion>({
    questions,
    timeLimit
  });

  // 사용자 선택 관리
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 퀴즈 시작 시 이미지 인덱스 초기화
  useEffect(() => {
    if (quizState === QuizState.QUESTION) {
      setCurrentImageIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  }, [quizState, currentQuestionIndex]);

  // 다음 이미지로 넘어가기
  const showNextImage = () => {
    if (currentImageIndex < 2) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  // 사용자 답변 처리
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = currentQuestion?.correctAnswer === answer;
    setIsCorrect(correct);
    
    // 잠시 후 답 화면으로 전환
    setTimeout(() => {
      showAnswer();
    }, 1000);
  };

  // 로딩 화면
  if (loading) {
    return (
      <QuizLayout title="Guess Who 퀴즈">
        <div className={styles.loadingContainer}>
          <p>퀴즈 데이터를 불러오는 중...</p>
        </div>
      </QuizLayout>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <QuizLayout title="Guess Who 퀴즈">
        <div className={styles.errorMessage}>
          <p>퀴즈 데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p>{error.message}</p>
        </div>
      </QuizLayout>
    );
  }

  // 퀴즈 시작 화면 렌더링
  const renderStartScreen = () => (
    <div className={styles.startScreen}>
      <h2>인물 맞추기 퀴즈</h2>
      <p>사진을 단계적으로 확대해 가며 인물을 맞추는 퀴즈입니다.</p>
      <p>각 문제마다 {timeLimit}초의 시간이 주어집니다.</p>
      <p>총 {questions.length}개의 문제가 출제됩니다.</p>
      <button className={styles.primaryButton} onClick={startQuiz}>퀴즈 시작하기</button>
    </div>
  );

  // 문제 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={styles.questionScreen}>
        <h2 className={styles.questionText}>{currentQuestion.question}</h2>
        
        <div className={styles.imageContainer}>
          {currentQuestion.imagePaths[currentImageIndex] && (
            <div className={styles.imageWrapper}>
              <Image 
                src={currentQuestion.imagePaths[currentImageIndex]} 
                alt="인물 사진"
                width={300}
                height={300}
                className={styles.questionImage}
              />
              <div className={styles.imageStatus}>
                {currentImageIndex + 1} / 3
              </div>
            </div>
          )}
        </div>
        
        {currentImageIndex < 2 && (
          <button 
            className={styles.nextImageButton} 
            onClick={showNextImage}
          >
            다음 사진 보기
          </button>
        )}
        
        <div className={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <button 
              key={index}
              className={`${styles.optionButton} ${selectedAnswer === option 
                ? isCorrect 
                  ? styles.correctOption 
                  : styles.wrongOption 
                : ''}`}
              onClick={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 정답 화면 렌더링
  const renderAnswerScreen = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={styles.answerScreen}>
        <div className={styles.answerDetails}>
          <p>문제: {currentQuestion.question}</p>
          <p>정답: <strong>{currentQuestion.correctAnswer}</strong></p>
          
          <div className={styles.allImagesContainer}>
            {currentQuestion.imagePaths.map((path, index) => (
              <div key={index} className={styles.smallImageWrapper}>
                <Image 
                  src={path} 
                  alt={`인물 사진 ${index + 1}`}
                  width={150}
                  height={150}
                  className={styles.smallImage}
                />
              </div>
            ))}
          </div>
        </div>
        <button 
          className={styles.primaryButton} 
          onClick={nextQuestion}
        >
          {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '결과 보기'}
        </button>
      </div>
    );
  };

  // 결과 화면 렌더링
  const renderResultScreen = () => (
    <div className={styles.resultScreen}>
      <h2>퀴즈 종료</h2>
      <button className={styles.primaryButton} onClick={resetQuiz}>다시 시작하기</button>
    </div>
  );

  // 현재 퀴즈 단계에 맞는 화면 렌더링
  const renderContent = () => {
    switch (quizState) {
      case QuizState.READY:
        return renderStartScreen();
      case QuizState.QUESTION:
        return renderQuestionScreen();
      case QuizState.ANSWER:
        return renderAnswerScreen();
      case QuizState.FINISHED:
        return renderResultScreen();
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>인물 맞추기 퀴즈 - 짱구아저씨 게임</title>
        <meta name="description" content="사진을 단계적으로 확대해 가며 인물을 맞추는 퀴즈" />
      </Head>
      <QuizLayout
        title="인물 맞추기 퀴즈"
        currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
        totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? questions.length : undefined}
        timeRemaining={quizState === QuizState.QUESTION ? timeRemaining : undefined}
        isGameOver={quizState === QuizState.FINISHED}
      >
        {renderContent()}
      </QuizLayout>
    </>
  );
};

export default GuessWhoQuizPage;
