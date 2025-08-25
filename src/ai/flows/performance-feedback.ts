'use server';

/**
 * @fileOverview Generates detailed feedback on interview answers, analyzing clarity, relevance, and structure.
 *
 * - generateFeedback - A function that generates feedback for an interview answer.
 * - PerformanceFeedbackInput - The input type for the generateFeedback function.
 * - PerformanceFeedbackOutput - The return type for the generateFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformanceFeedbackInputSchema = z.object({
  question: z.string().describe('The interview question asked.'),
  answer: z.string().describe('The user\'s answer to the interview question.'),
});
export type PerformanceFeedbackInput = z.infer<typeof PerformanceFeedbackInputSchema>;

const PerformanceFeedbackOutputSchema = z.object({
  clarity: z.string().describe('Analysis of the answer\'s clarity.'),
  relevance: z.string().describe('Analysis of the answer\'s relevance to the question.'),
  structure: z.string().describe('Analysis of the answer\'s overall structure and organization.'),
  overallFeedback: z.string().describe('Overall feedback and suggestions for improvement.'),
});
export type PerformanceFeedbackOutput = z.infer<typeof PerformanceFeedbackOutputSchema>;

export async function generateFeedback(input: PerformanceFeedbackInput): Promise<PerformanceFeedbackOutput> {
  return performanceFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'performanceFeedbackPrompt',
  input: {schema: PerformanceFeedbackInputSchema},
  output: {schema: PerformanceFeedbackOutputSchema},
  prompt: `You are an expert interview coach providing feedback on interview answers.

  Analyze the following answer to the question, providing detailed feedback on clarity, relevance, and structure. Provide a concise overall feedback with suggestions for improvement.

  Question: {{{question}}}
  Answer: {{{answer}}}

  Focus on actionable insights that the candidate can use to improve their interviewing skills.

  Your analysis should be structured as follows:

  Clarity: [Your analysis of the answer's clarity]
  Relevance: [Your analysis of the answer's relevance to the question]
  Structure: [Your analysis of the answer's structure and organization]
  Overall Feedback: [Overall feedback and suggestions for improvement]`,
});

const performanceFeedbackFlow = ai.defineFlow(
  {
    name: 'performanceFeedbackFlow',
    inputSchema: PerformanceFeedbackInputSchema,
    outputSchema: PerformanceFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
