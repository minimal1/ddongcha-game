import { NextPage } from 'next';
import Head from 'next/head';
import QuizLayout from '@/features/user/quiz/ui/QuizLayout';
import { useQuiz, QuizState } from '@/features/user/quiz/lib/useQuiz';
import { PhotoYearQuestion } from '@/features/user/quiz/model/quiz.model';
import styles from '@/features/user/quiz/ui/PhotoYearQuiz.module.css';


const questions: PhotoYearQuestion[] = []

const PhotoYearQuizPage: NextPage = () => {
  // 퀴즈 훅 사용
  const {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    startQuiz,
    showAnswer,
    nextQuestion,
    resetQuiz
  } = useQuiz<PhotoYearQuestion>({
    questions,
  });

  // 퀴즈 시작 화면 렌더링
  const renderStartScreen = () => (
    <div className={styles.startScreen}>
      <h2>스타 사진 퀴즈 - 촬영 연도</h2>
      <p>사진이 촬영된 연도를 맞추는 퀴즈입니다.</p>
      <p>총 {questions.length}개의 질문이 출제됩니다.</p>
      <button className={styles.primaryButton} onClick={startQuiz}>퀴즈 시작하기</button>
    </div>
  );

  // 질문 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={styles.questionScreen}>
        <div className={styles.photoContainer}>
          <div className={styles.photoWrapper}>
            <div className={styles.imagePlaceholder}>
              [이미지: {currentQuestion.imagePath}]
            </div>
          </div>
        </div>
        
        <div className={styles.questionText}>
          <p>이 사진은 언제 촬영되었을까요?</p>
        </div>
        
       
        <button className={styles.primaryButton} onClick={showAnswer}>
          정답 보기
        </button>
      </div>
    );
  };

  // 정답 화면 렌더링
  const renderAnswerScreen = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={styles.answerScreen}>
        <div className={styles.photoAnswerContainer}>
          <div className={styles.imagePlaceholder}>
            [이미지: {currentQuestion.imagePath}]
          </div>
        </div>
        
        <div className={styles.answerDetails}>
          <p>정답: <strong>{currentQuestion.correctAnswer}년</strong></p>
        </div>
        
        <button className={styles.primaryButton} onClick={nextQuestion}>
          {currentQuestionIndex < questions.length - 1 ? '다음 질문' : '결과 보기'}
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
        <title>스타 사진 퀴즈 - 촬영 연도 - 똥차레크리에이션 게임</title>
        <meta name="description" content="사진이 촬영된 연도를 맞추는 퀴즈" />
      </Head>
      <QuizLayout
        title="스타 사진 퀴즈 - 촬영 연도"
        currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
        totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? questions.length : undefined}
      >
        {renderContent()}
      </QuizLayout>
    </>
  );
};

export default PhotoYearQuizPage;