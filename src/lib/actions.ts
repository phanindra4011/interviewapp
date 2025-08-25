'use server';

import { aiInterviewer, AIInterviewerOutput } from '@/ai/flows/ai-interviewer';
import { generateFeedback, PerformanceFeedbackOutput } from '@/ai/flows/performance-feedback';
import type { InterviewMessage, InterviewReport } from './types';

export async function getInitialQuestion(interviewType: string, difficultyLevel: string): Promise<AIInterviewerOutput> {
  return await aiInterviewer({
    interviewType,
    difficultyLevel,
    currentQuestion: 'The user is ready to begin.',
    userResponse: 'Let\'s start.',
  });
}

export async function getNextQuestion(
  interviewType: string,
  difficultyLevel: string,
  currentQuestion: string,
  userResponse: string
): Promise<AIInterviewerOutput> {
  return await aiInterviewer({
    interviewType,
    difficultyLevel,
    currentQuestion,
    userResponse,
  });
}

export async function generateReport(messages: InterviewMessage[]): Promise<InterviewReport> {
  const report: InterviewReport = {};
  const qaPairs: { question: string; answer: string }[] = [];

  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].role === 'assistant' && messages[i + 1].role === 'user') {
      qaPairs.push({
        question: messages[i].content,
        answer: messages[i + 1].content,
      });
    }
  }

  const feedbackPromises = qaPairs.map(pair => 
    generateFeedback({ question: pair.question, answer: pair.answer })
  );

  const feedbackResults = await Promise.all(feedbackPromises);

  qaPairs.forEach((pair, index) => {
    report[pair.question] = feedbackResults[index];
  });

  return report;
}
