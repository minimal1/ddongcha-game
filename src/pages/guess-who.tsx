import { NextPage } from 'next';
import Head from 'next/head';
import QuizLayout from '@/features/user/quiz/ui/QuizLayout';
import { useQuiz, QuizState } from '@/features/user/quiz/lib/useQuiz';
import { GuessWhoQuestion } from '@/features/user/quiz/model/quiz.model';
import styles from '@/features/user/quiz/ui/GuessWhoQuiz.module.css';

const questions: GuessWhoQuestion[] = []
const GuessWhoQuizPage: NextPage = () => {
  // 퀴즈 훅 사용
  const {
    currentQuestion,
    currentQuestionIndex,
    quizState,
    startQuiz,
    showAnswer,
    nextQuestion,
    resetQuiz
  } = useQuiz<GuessWhoQuestion>({
    questions,
  });

  // 퀴즈 시작 화면 렌더링
  const renderStartScreen = () => (
    <div className={styles.startScreen}>
      <h2>추억 사진 퀴즈 - 얼굴 줌 아웃</h2>
      <p>확대된 얼굴 사진에서 점점 줌 아웃되며 누구인지 맞추는 게임입니다.</p>
      <p>총 {questions.length}개의 문제가 출제됩니다.</p>
      <button className={styles.primaryButton} onClick={startQuiz}>게임 시작하기</button>
    </div>
  );

  // 문제 화면 렌더링
  const renderQuestionScreen = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className={styles.questionScreen}>
        <div className={styles.faceZoomContainer}>
          <div className={`${styles.faceImage}`}>
            <div className={styles.imagePlaceholder}>
              [이미지: {currentQuestion.imagePath}]
            </div>
          </div>
        </div>
        
        <div className={styles.questionText}>이 사진 속 인물은 누구인가요?</div>
        
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
        <div className={styles.faceFullImage}>
          <div className={styles.imagePlaceholder}>
            [이미지: {currentQuestion.imagePath} - 전체 이미지]
          </div>
        </div>
        <div className={styles.answerDetails}>
          <p>정답: <strong>{currentQuestion.correctAnswer}</strong></p>
        </div>
        <button className={styles.primaryButton} onClick={nextQuestion}>
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
        <title>추억 사진 퀴즈 - 얼굴 줌 아웃 - 레크리에이션 게임</title>
        <meta name="description" content="확대된 얼굴 사진을 보고 누구인지 맞추는 게임" />
      </Head>
      <QuizLayout
        title="추억 사진 퀴즈 - 얼굴 맞추기"
        currentQuestion={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? currentQuestionIndex + 1 : undefined}
        totalQuestions={quizState !== QuizState.READY && quizState !== QuizState.FINISHED ? questions.length : undefined}
      >
        {renderContent()}
      </QuizLayout>
    </>
  );
};

export default GuessWhoQuizPage;