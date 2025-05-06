import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import QuizLayout from '@/features/user/quiz/ui/QuizLayout';
import { useQuiz, QuizState } from '@/features/user/quiz/lib/useQuiz';
import styles from '@/features/user/quiz/ui/GuessWhoQuiz.module.css';
import useQuizData from '@/features/user/quiz/lib/useQuizData';
import React from 'react';

const GuessWhoQuizPage: NextPage = () => {
  // 현재 보고 있는 이미지 인덱스를 관리하는 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Supabase에서 인물 퀴즈 데이터 가져오기
  const { questions, loading, error } = useQuizData({
    questionType: 'guess-who',
    limit: 50,
  });

  // 퀴즈 관리 사용
  const {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    startQuiz,
    showAnswer,
    nextQuestion,
    resetQuiz
  } = useQuiz({
    questions,
  });

  // 다음 이미지로 전환하는 함수
  const showNextImage = () => {
    if (currentQuestion && currentImageIndex < currentQuestion.imageUrls.length - 1) {
      setCurrentImageIndex(prevIndex => prevIndex + 1);
    }
  };

  // 새 문제로 넘어갈 때 이미지 인덱스 초기화
  const handleNextQuestion = () => {
    setCurrentImageIndex(0);
    nextQuestion();
  };

  // 퀴즈 시작 시 이미지 인덱스 초기화
  const handleStartQuiz = () => {
    setCurrentImageIndex(0);
    startQuiz();
  };

  // 액션 버튼 렌더링 - 게임 상태에 따라 다른 버튼 표시
  const renderActionButtons = () => {
    switch (quizState) {
      case QuizState.QUESTION:
        // 문제 화면에서는 다음 이미지 버튼과 정답 보기 버튼 중 상황에 맞는 것 표시
        const hasImages = currentQuestion?.imageUrls && currentQuestion.imageUrls.length > 0;
        const isLastImage = !hasImages || currentImageIndex === currentQuestion.imageUrls.length - 1;
        
        if (!isLastImage) {
          return (
            <button 
              className={styles.headerActionButton} 
              onClick={showNextImage}
            >
              다음 사진 보기
            </button>
          );
        } else {
          return (
            <button 
              className={styles.headerActionButton} 
              onClick={showAnswer}
            >
              정답 보기
            </button>
          );
        }
      case QuizState.ANSWER:
        return (
          <button 
            className={styles.headerActionButton} 
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        );
      case QuizState.FINISHED:
        return (
          <button 
            className={styles.headerActionButton} 
            onClick={resetQuiz}
          >
            다시 시작하기
          </button>
        );
      default:
        return null;
    }
  };

  // 퀴즈 시작 화면 렌더링
  const renderStartScreen = () => {
    if (loading) {
      return (
        <div className={styles.startScreen}>
          <h2>인물 퀴즈 데이터 로딩 중...</h2>
          <p>잠시만 기다려주세요.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.startScreen}>
          <h2>오류 발생</h2>
          <p>인물 퀴즈 데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p>{error.message}</p>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className={styles.startScreen}>
          <h2>퀴즈 없음</h2>
          <p>현재 사용 가능한 퀴즈가 없습니다.</p>
        </div>
      );
    }
    
    return (
      <div className={styles.startScreen}>
        <h2>인물 사진 퀴즈 - 힌트 맞추기</h2>
        <p>확대된 얼굴 사진에서 힌트 맞추기를 통해 인물을 맞추는 퀴즈입니다.</p>
        <p>총 {questions.length}개의 문제가 준비되었습니다.</p>
        <button className={styles.primaryButton} onClick={handleStartQuiz}>퀴즈 시작하기</button>
      </div>
    );
  };

  // 문제 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    const hasImages = currentQuestion.imageUrls && currentQuestion.imageUrls.length > 0;
    const imageUrl = hasImages ? currentQuestion.imageUrls[currentImageIndex] : '';
    const isLastImage = !hasImages || currentImageIndex === currentQuestion.imageUrls.length - 1;
    
    return (
      <div className={styles.questionScreen}>
        <div className={styles.faceZoomContainer}>
          {imageUrl ? (
            <div className={styles.imageContainer}>
              <img 
                src={imageUrl}
                alt="인물 사진"
                className={styles.faceImage}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          ) : (
            <div className={styles.imagePlaceholder}>
              [이미지가 없습니다]
            </div>
          )}
        </div>
        
        <div className={styles.questionText}>이 사진 속 인물은 누구일까요?</div>
        
        {hasImages && currentQuestion.imageUrls.length > 1 && (
          <div className={styles.imageNavigation}>
            <p>사진 {currentImageIndex + 1} / {currentQuestion.imageUrls.length}</p>
          </div>
        )}
        
        {isLastImage && (
          <button className={styles.primaryButton} onClick={showAnswer}>
            정답 보기
          </button>
        )}
      </div>
    );
  };

  // 정답 화면 렌더링
  const renderAnswerScreen = () => {
    if (!currentQuestion) return null;
    
    const hasImages = currentQuestion.imageUrls && currentQuestion.imageUrls.length > 0;
    const imageUrl = hasImages ? currentQuestion.imageUrls[currentQuestion.imageUrls.length-1] : '';
    
    return (
      <div className={styles.answerScreen}>
        <div className={styles.faceFullImage}>
          {imageUrl ? (
            <div className={styles.imageContainer}>
              <img 
                src={imageUrl}
                alt="인물 사진" 
                className={styles.faceImage}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          ) : (
            <div className={styles.imagePlaceholder}>
              [이미지가 없습니다]
            </div>
          )}
        </div>
        
        <div className={styles.answerDetails}>
          <p>정답: <strong>{currentQuestion.answer}</strong></p>
        </div>
      </div>
    );
  };

  // 결과 화면 렌더링
  const renderResultScreen = () => (
    <div className={styles.resultScreen}>
      <h2>퀴즈 종료</h2>
      <p>총 {questions.length}개의 인물 퀴즈를 완료했습니다!</p>
      <button className={styles.primaryButton} onClick={resetQuiz}>다시 시작하기</button>
    </div>
  );

  // 현재 퀴즈 상태에 따라 적절한 화면 렌더링
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
        <title>인물 사진 퀴즈 - 힌트 맞추기 - 똥차에이트 퀴즈</title>
        <meta name="description" content="확대된 얼굴 사진을 보고 힌트를 통해 인물을 맞추는 퀴즈" />
      </Head>
      <QuizLayout
        title="인물 사진 퀴즈 - 힌트 맞추기"
        currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
        totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? questions.length : undefined}
        actionButtons={renderActionButtons()} // 액션 버튼 추가
      >
        {renderContent()}
      </QuizLayout>
    </>
  );
};

export default GuessWhoQuizPage;
