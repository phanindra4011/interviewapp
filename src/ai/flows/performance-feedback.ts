'use server';

/**
 * @fileOverview Generates detailed feedback on interview answers, analyzing clarity, relevance, and structure.
 *
 * - generateFeedback - A function that generates feedback for an interview answer.
 * - PerformanceFeedbackInput - The input type for the generateFeedback function.
 * - PerformanceFeedbackOutput - The return type for the generateFeedback function.
 */

import {gemini} from '@/ai/gemini';

export type PerformanceFeedbackInput = {
  question: string;
  answer: string;
};

export type PerformanceFeedbackOutput = {
  feedback: string;
};

export async function generateFeedback(input: PerformanceFeedbackInput): Promise<PerformanceFeedbackOutput> {
  const prompt = `You are an expert technical interviewer. Given the following question and answer, provide brief, constructive feedback to help the candidate improve.\n\nQuestion: ${input.question}\nAnswer: ${input.answer}\n\nFeedback:`;
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    const json = JSON.parse(text);
    return { feedback: json.feedback };
  } catch {
    return { feedback: text };
  }
}

