import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import QuizLayout from '@/features/user/quiz/ui/QuizLayout';
import { useQuiz, QuizState } from '@/features/user/quiz/lib/useQuiz';
import styles from '@/features/user/quiz/ui/PhotoYearQuiz.module.css';
import useQuizData from '@/features/user/quiz/lib/useQuizData';

const PhotoYearQuizPage: NextPage = () => {
  // Supabase에서 스냅 사진 퀴즈 데이터 가져오기
  const { questions, loading, error } = useQuizData({
    questionType: 'photo-year',
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

  // 액션 버튼 렌더링 - 게임 상태에 따라 다른 버튼 표시
  const renderActionButtons = () => {
    switch (quizState) {
      case QuizState.QUESTION:
        return (
          <button 
            className={styles.headerActionButton} 
            onClick={showAnswer}
          >
            정답 보기
          </button>
        );
      case QuizState.ANSWER:
        return (
          <button 
            className={styles.headerActionButton} 
            onClick={nextQuestion}
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
          <h2>사진 퀴즈 데이터 로딩 중...</h2>
          <p>잠시만 기다려주세요.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.startScreen}>
          <h2>오류 발생</h2>
          <p>사진 퀴즈 데이터를 불러오는 중 오류가 발생했습니다.</p>
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
        <h2>사진 퀴즈 - 촬영 연도</h2>
        <p>사진이 촬영된 연도를 맞추는 퀴즈입니다.</p>
        <p>총 {questions.length}개의 문제가 준비되었습니다.</p>
        <button className={styles.primaryButton} onClick={startQuiz}>퀴즈 시작하기</button>
      </div>
    );
  };

  // 문제 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    const imageUrl = currentQuestion.imageUrls && currentQuestion.imageUrls.length > 0 
      ? currentQuestion.imageUrls[0] 
      : '';
    
    return (
      <div className={styles.questionScreen}>
        <div className={styles.photoContainer}>
          <div className={styles.photoWrapper}>
            {imageUrl ? (
              <div className={styles.imageContainer}>
                <img 
                    src={imageUrl}
                    alt="연도를 맞춰야 하는 사진"
                    className={styles.photoImage}
                    style={{ maxWidth: '100%', height: 'auto' }}
                 />
              </div>
            ) : (
              <div className={styles.imagePlaceholder}>
                [이미지가 없습니다]
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.questionText}>
          <p>이 사진은 언제 촬영되었을까요?</p>
        </div>
      </div>
    );
  };

  // 정답 화면 렌더링
  const renderAnswerScreen = () => {
    if (!currentQuestion) return null;
    
    const imageUrl = currentQuestion.imageUrls && currentQuestion.imageUrls.length > 0 
      ? currentQuestion.imageUrls[0] 
      : '';
    
    return (
      <div className={styles.answerScreen}>
        <div className={styles.photoAnswerContainer}>
          {imageUrl ? (
            <div className={styles.imageContainer}>
              <img 
                src={imageUrl}
                alt="연도를 맞춰야 하는 사진" 
                className={styles.photoImage}
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
          <p>정답: <strong>{currentQuestion.answer}년</strong></p>
        </div>
      </div>
    );
  };

  // 결과 화면 렌더링
  const renderResultScreen = () => (
    <div className={styles.resultScreen}>
      <h2>퀴즈 종료</h2>
      <p>총 {questions.length}개의 사진 퀴즈를 완료했습니다!</p>
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
        <title>사진 퀴즈 - 촬영 연도</title>
        <meta name="description" content="사진이 촬영된 연도를 맞추는 퀴즈" />
      </Head>
      <QuizLayout
        title="사진 퀴즈 - 촬영 연도"
        currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
        totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? questions.length : undefined}
        actionButtons={renderActionButtons()} // 액션 버튼 추가
      >
        {renderContent()}
      </QuizLayout>
    </>
  );
};

export default PhotoYearQuizPage;
