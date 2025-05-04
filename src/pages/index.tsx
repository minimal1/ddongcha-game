import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { QuizType } from '@/types/quiz';

const quizzes: { type: QuizType; title: string; description: string }[] = [
  {
    type: 'trivia',
    title: '일반 상식 퀴즈',
    description: '다양한 분야의 상식을 테스트하는 퀴즈입니다.',
  },
  {
    type: 'movie',
    title: '영화 대사 퀴즈',
    description: '유명 영화 속 대사를 보고 영화를 맞추세요.',
  },
  {
    type: 'photo-year',
    title: '사진 연도 퀴즈',
    description: '사진이 촬영된 연도를 맞추는 퀴즈입니다.',
  },
  {
    type: 'guess-who',
    title: '누구일까요?',
    description: '흐릿한 사진을 보고 인물을 맞추는 퀴즈입니다.',
  },
];

export default function HomePage() {
  return (
    <Layout>
      <div className="container py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">똥차 퀴즈</h1>
          <p className="text-muted-foreground">재미있는 퀴즈로 당신의 지식을 테스트하세요!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.type} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <span className="text-4xl">🎮</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/${quiz.type}`} className="w-full">
                  <Button className="w-full">시작하기</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
