export type Subject =
  | "Língua Portuguesa"
  | "Matemática"
  | "Ciências da Natureza"
  | "Ciências Humanas"
  | "Informática"
  | "Conhecimentos Específicos";
export type GoalType =
  | "escolar"
  | "enem"
  | "vestibular"
  | "concurso"
  | "outros";
export type LearnFormat =
  | "Leitura"
  | "Vídeo"
  | "Exercícios"
  | "Áudio"
  | "Mapa mental";
export interface Goal {
  id: string;
  type: GoalType;
  name: string;
  board: string;
  target: string;
  date: string;
  active: boolean;
}
export interface Profile {
  name: string;
  minutes: number;
  difficulties: Subject[];
  formats: LearnFormat[];
  onboarded: boolean;
  diagnosticDone: boolean;
  focus: Subject[];
  reminder: string;
  reminderEnabled: boolean;
  community: boolean;
  nickname: string;
}
export interface Question {
  id: string;
  subject: Subject;
  level: 1 | 2 | 3 | 4 | 5;
  topic: string;
  prompt: string;
  options: string[];
  correct: number;
  explanations: string[];
  lesson: string;
  kind: "universal" | "concurso" | "escolar";
}
export interface Answer {
  id: string;
  questionId: string;
  selected: number;
  correct: boolean;
  subject: Subject;
  at: string;
  seconds: number;
  quizId: string;
  board?: string;
  goalId?: string;
}
export interface QuizResult {
  id: string;
  at: string;
  kind: string;
  correct: number;
  total: number;
  difficulty: string[];
}
export interface ReviewCard {
  id: string;
  front: string;
  back: string;
  subject: string;
  due: string;
  interval: number;
}
export interface Activity {
  id: string;
  title: string;
  subject: Subject;
  topic: string;
  minutes: number;
  kind: LearnFormat;
}
export interface AppState {
  version: 1;
  dailyPlans?: Record<string, { signature: string; activities: Activity[] }>;
  focusSessions?: { id: string; day: string; minutes: number }[];
  profile: Profile;
  goals: Goal[];
  answers: Answer[];
  quizzes: QuizResult[];
  completions: Record<string, string[]>;
  studyMinutes: Record<string, number>;
  cards: ReviewCard[];
  bookmarks: string[];
  recapSeen: string;
  createdAt: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
}
export type Page =
  | "home"
  | "study"
  | "goals"
  | "performance"
  | "community"
  | "profile";
