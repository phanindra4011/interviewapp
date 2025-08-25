'use server';

/**
 * @fileOverview Implements the AI Interviewer flow for generating adaptive interview questions and analyzing user responses.
 *
 * - `aiInterviewer`: The main function to start the interview process.
 * - `AIInterviewerInput`: The input type for the `aiInterviewer` function.
 * - `AIInterviewerOutput`: The return type for the `aiInterviewer` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIInterviewerInputSchema = z.object({
  userResponse: z
    .string()
    .describe('The user response to the current interview question.'),
  currentQuestion: z.string().describe('The current interview question.'),
  topic: z
    .string()
    .describe('The topic of the interview (e.g., "React Hooks", "Javascript Promises").'),
});
export type AIInterviewerInput = z.infer<typeof AIInterviewerInputSchema>;

const AIInterviewerOutputSchema = z.object({
  nextQuestion: z.string().describe('The next interview question to ask the user.'),
  feedback: z.string().describe('Feedback on the user response.'),
});
export type AIInterviewerOutput = z.infer<typeof AIInterviewerOutputSchema>;

export async function aiInterviewer(input: AIInterviewerInput): Promise<AIInterviewerOutput> {
  return aiInterviewerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiInterviewerPrompt',
  input: {schema: AIInterviewerInputSchema},
  output: {schema: AIInterviewerOutputSchema},
  prompt: `You are an AI interviewer designed to conduct realistic and challenging mock interviews.

The topic for this interview is: {{{topic}}}. All of your questions and feedback should revolve around this topic.

Here is the current state of the interview:
- The last question you asked: {{{currentQuestion}}}
- The user's response: {{{userResponse}}}

Your tasks are:
1.  Based on the user's response to the last question, generate a relevant follow-up question that remains focused on the interview topic. If the user has not provided a response yet, generate the first question based on the topic.
2.  Provide brief, constructive feedback on the user's answer. Comment on its clarity, relevance to the topic, and overall structure. The goal is to help the user improve.

Please provide your response in the format defined by the output schema.`,
});

const aiInterviewerFlow = ai.defineFlow(
  {
    name: 'aiInterviewerFlow',
    inputSchema: AIInterviewerInputSchema,
    outputSchema: AIInterviewerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
