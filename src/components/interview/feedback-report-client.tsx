'use client';

import { useState } from 'react';
import { useInterviewStore } from '@/hooks/use-interview-store';
import { useRouter } from 'next/navigation';
import { generateReport } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ChatMessage from './chat-message';
import { Loader2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function FeedbackReportClient({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const { getInterview, updateInterview } = useInterviewStore();
  const interview = getInterview(interviewId);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!interview) return;
    setIsGenerating(true);
    try {
      const report = await generateReport(interview.messages);
      updateInterview(interviewId, { report });
    } catch (error) {
      console.error('Failed to generate report:', error);
      // You could show a toast here
    } finally {
      setIsGenerating(false);
    }
  };

  if (!interview) {
     return (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <Alert variant="destructive" className="max-w-md">
                <AlertTitle>Interview Not Found</AlertTitle>
                <AlertDescription>
                    The interview session could not be found.
                </AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/history')}>Back to History</Button>
        </div>
    );
  }

  const qaPairs = interview.messages.reduce((acc, message, index) => {
    if (message.role === 'assistant') {
      const nextMessage = interview.messages[index + 1];
      if (nextMessage && nextMessage.role === 'user') {
        acc.push({ question: message.content, answer: nextMessage.content });
      }
    }
    return acc;
  }, [] as { question: string; answer: string }[]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interview Report</h1>
        <p className="text-muted-foreground capitalize">
          {interview.settings.topic} -{' '}
          {format(new Date(interview.createdAt), 'MMMM d, yyyy')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {!interview.report ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 text-center">
              <h3 className="text-xl font-semibold">Generate your report</h3>
              <p className="text-muted-foreground">
                Get detailed, AI-powered feedback on your performance.
              </p>
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Feedback
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
              {qaPairs.map((pair, index) => {
                const feedback = interview.report?.[pair.question];
                return (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                      <span className="text-left">Question {index + 1}: {pair.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="italic text-muted-foreground">Your answer: "{pair.answer}"</p>
                      {feedback ? (
                        <div className="space-y-4">
                            <FeedbackSection title="Clarity" content={feedback.clarity} />
                            <FeedbackSection title="Relevance" content={feedback.relevance} />
                            <FeedbackSection title="Structure" content={feedback.structure} />
                            <FeedbackSection title="Overall Feedback" content={feedback.overallFeedback} />
                        </div>
                      ) : <p>No feedback available for this question.</p>}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Full Transcript</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {interview.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function FeedbackSection({ title, content }: { title: string; content: string }) {
    return (
        <div>
            <h4 className="font-semibold text-primary">{title}</h4>
            <p className="text-sm">{content}</p>
        </div>
    )
}
