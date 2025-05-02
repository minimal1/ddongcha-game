import { MovieQuestion } from "@/shared/lib/types";

// 영화 퀴즈 문제 목록
export const movieQuestions: MovieQuestion[] = [
  {
    id: 1,
    type: "quote",
    content: "타이타닉",
    correctAnswer: "난 세상의 왕이야!",
    options: [
      "난 세상의 왕이야!",
      "안녕히 계세요 여러분!",
      "내 인생은 너무 눈부셔",
      "여긴 너무 위험해",
    ],
  },
  {
    id: 2,
    type: "title",
    content: "내가 자는 동안, 내 집에 도둑이 들었다",
    correctAnswer: "나 홀로 집에",
    options: ["도둑들", "나 홀로 집에", "도둑 맞은 집", "홈 얼론"],
  },
  {
    id: 3,
    type: "quote",
    content: "매트릭스",
    correctAnswer: "진실을 원하는가, 아니면 행복을 원하는가",
    options: [
      "배틀로얄에 오신것을 환영합니다",
      "진실을 원하는가, 아니면 행복을 원하는가",
      "나는 기계가 아니다",
      "현실은 생각보다 가혹하다",
    ],
  },
  {
    id: 4,
    type: "title",
    content: "피터 파커가 거미에게 물린 후 슈퍼 히어로가 된다",
    correctAnswer: "스파이더맨",
    options: ["앤트맨", "스파이더맨", "배트맨", "아이언맨"],
  },
  {
    id: 5,
    type: "quote",
    content: "겨울왕국",
    correctAnswer: "다 잊어, 다 잊어",
    options: [
      "다 잊어, 다 잊어",
      "사랑은 열린 문",
      "사랑해요 누나",
      "내가 누군지 알아?",
    ],
  },
  {
    id: 6,
    type: "title",
    content: "사자, 양철 나무꾼, 허수아비, 소녀와 개가 오즈를 찾아 떠난다",
    correctAnswer: "오즈의 마법사",
    options: [
      "신비한 동물사전",
      "나니아 연대기",
      "오즈의 마법사",
      "반지의 제왕",
    ],
  },
  {
    id: 7,
    type: "quote",
    content: "반지의 제왕",
    correctAnswer: "내 보물이다",
    options: [
      "내 보물이다",
      "마법은 끝났다",
      "반지를 던져",
      "어둠에서 벗어나라",
    ],
  },
  {
    id: 8,
    type: "title",
    content: "꿈속에서 정보를 훔치는 팀이 꿈의 깊은 단계로 들어가는 이야기",
    correctAnswer: "인셉션",
    options: ["인셉션", "매트릭스", "마션", "인터스텔라"],
  },
  {
    id: 9,
    type: "quote",
    content: "인터스텔라",
    correctAnswer: "사랑은 시공간을 초월하지",
    options: [
      "저 너머에 무엇이 있는지",
      "시간은 상대적이야",
      "사랑은 시공간을 초월하지",
      "지구는 이제 안녕",
    ],
  },
  {
    id: 10,
    type: "title",
    content:
      "무역회사 직원이 무인도에 표류해 발견한 배구공을 친구 삼아 생존한다",
    correctAnswer: "캐스트 어웨이",
    options: [
      "라이프 오브 파이",
      "더 터미널",
      "로빈슨 크루소",
      "캐스트 어웨이",
    ],
  },
];

// 게임 기본 설정
export const MOVIE_QUIZ_TIME_LIMIT = 20; // 문제당 20초
