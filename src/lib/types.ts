import type { PerformanceFeedbackOutput } from '@/ai/flows/performance-feedback';

export type InterviewMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  feedbackOnAnswer?: string; 
};

export type InterviewSettings = {
  topic: string;
  difficulty: "Beginner" | "Medium" | "Pro";
};

export type InterviewReport = {
  [question: string]: PerformanceFeedbackOutput;
};

export type InterviewSession = {
  id: string;
  createdAt: number;
  settings: InterviewSettings;
  messages: InterviewMessage[];
  report?: InterviewReport | null;
  isFinished: boolean;
};
