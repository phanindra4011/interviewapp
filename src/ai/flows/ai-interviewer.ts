
import { gemini } from "@/ai/gemini";

export type AIInterviewerInput = {
  userResponse: string;
  currentQuestion: string;
  topic: string;
  difficulty: string;
  history: { question: string; answer: string }[];
};

export type AIInterviewerOutput = {
  nextQuestion: string;
  feedback: string;
};

export async function aiInterviewer(input: AIInterviewerInput): Promise<AIInterviewerOutput> {
  // Compose the prompt for Gemini
  const historyText = input.history.map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`).join("\n");
  const userSeemsUnsure = /\b(i\s*don'?t\s*know|dont\s*know|not\s*sure|no\s*idea|idk|skip(?:\s*this|\s*question)?)\b/i.test(input.userResponse);
  const extraGuidance = userSeemsUnsure
    ? `Since the user's response indicates uncertainty or a skip, include in the feedback: (a) a concise correct answer labeled exactly as: "Correct answer: <answer>", and (b) a short 2–3 sentence explanation of why this is the answer, optionally with one practical tip.`
    : `If the user's response is partially correct, point out the gap and give a short correction.`;
  const disclaimer = `Always end the feedback with this one sentence disclaimer: "Disclaimer: This AI can make mistakes."`;
  const prompt = `You are an AI interviewer. Your goal is to conduct a realistic mock interview.\n\nThis interview is about the following topic: ${input.topic}.\nThe difficulty level for this interview is: ${input.difficulty}.\n\nYou must adhere to this topic and difficulty for all questions and feedback.\n\nHere is the full history of the interview so far (do not repeat any of these questions):\n${historyText}\n\nThe last question you asked: ${input.currentQuestion}\nThe user's response: ${input.userResponse}\n\nYour tasks are:\n1. Generate a relevant follow-up question that has NOT been asked before in this interview. The question must be directly related to the topic and at the specified difficulty. If the user has not provided a response yet, generate the first question based on the topic and difficulty.\n2. Provide brief, constructive feedback on the user's previous answer. ${extraGuidance} ${disclaimer}\n\nDo NOT repeat any previous questions. Respond in JSON with keys 'nextQuestion' and 'feedback'.`;

  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  // Try to parse the JSON from the model's response
  try {
    const json = JSON.parse(text);
    return {
      nextQuestion: json.nextQuestion,
      feedback: json.feedback,
    };
  } catch (e) {
    // fallback: try to extract with regex
    const matchQ = text.match(/"nextQuestion"\s*:\s*"([^"]+)"/);
    const matchF = text.match(/"feedback"\s*:\s*"([^"]+)"/);
    return {
      nextQuestion: matchQ ? matchQ[1] : "(Could not parse next question)",
      feedback: matchF ? matchF[1] : "(Could not parse feedback)",
    };
  }
}
