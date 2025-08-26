import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/lib/actions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: 'Missing or invalid messages.' }, { status: 400 });
    }
    const report = await generateReport(body.messages);
    return NextResponse.json(report);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to generate report.' }, { status: 500 });
  }
}
