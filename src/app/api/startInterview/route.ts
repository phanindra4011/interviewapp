import { NextRequest, NextResponse } from 'next/server';
import { aiInterviewer } from '@/ai/flows/ai-interviewer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Validate required fields
    if (!body.topic || !body.difficulty) {
      return NextResponse.json({ error: 'Missing topic or difficulty.' }, { status: 400 });
    }
    // Compose the input for aiInterviewer
    const input = {
      topic: body.topic,
      difficulty: body.difficulty,
      currentQuestion: body.currentQuestion || 'The user is ready to begin.',
      userResponse: body.userResponse || "Let's start.",
      history: body.history || [],
    };
    const result = await aiInterviewer(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to start interview.' }, { status: 500 });
  }
}
