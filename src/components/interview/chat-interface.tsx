
'use client';
import { useState, useRef, useEffect } from 'react';
import { generateInterviewPDF } from '@/lib/pdf';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/hooks/use-interview-store';
import { getNextQuestion } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';
import ChatMessage from './chat-message';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';

export default function ChatInterface({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { getInterview, updateInterview } = useInterviewStore();
  const interview = getInterview(interviewId);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [interview?.messages]);

  if (!interview) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Interview Not Found</AlertTitle>
          <AlertDescription>
            The interview session could not be found. It might have been deleted or the link is incorrect.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/')}>Start a New Interview</Button>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending || interview.isFinished) return;
    setIsSending(true);
    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user' as const,
      content: inputValue,
    };
    const updatedMessages = [...interview.messages, userMessage];
    updateInterview(interviewId, { messages: updatedMessages });
    setInputValue('');
    try {
      const lastAssistantMessage = interview.messages.filter((m) => m.role === 'assistant').pop();
      if (!lastAssistantMessage) throw new Error('Could not find the last question from the assistant.');
      // Build Q&A history for the AI
      const qaHistory = [];
      for (let i = 0; i < interview.messages.length - 1; i++) {
        if (interview.messages[i].role === 'assistant' && interview.messages[i + 1].role === 'user') {
          qaHistory.push({
            question: interview.messages[i].content,
            answer: interview.messages[i + 1].content,
          });
        }
      }
      const response = await getNextQuestion({
        topic: interview.settings.topic,
        difficulty: interview.settings.difficulty,
        currentQuestion: lastAssistantMessage.content,
        userResponse: userMessage.content,
        history: qaHistory,
      });
      const assistantMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant' as const,
        content: response.nextQuestion,
        feedbackOnAnswer: response.feedback,
      };
      updateInterview(interviewId, { messages: [...updatedMessages, assistantMessage] });
    } catch (error) {
      console.error('Failed to get next question:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get the next question. Please try again.',
      });
      updateInterview(interviewId, { messages: interview.messages });
    } finally {
      setIsSending(false);
    }
  };

  const handleFinishInterview = () => {
    updateInterview(interviewId, { isFinished: true });
    router.push(`/report/${interviewId}`);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold capitalize">{interview.settings.topic} Interview</h2>
          <Badge variant="outline" className="capitalize">{interview.settings.difficulty}</Badge>
        </div>
        <Button onClick={handleFinishInterview} disabled={interview.isFinished} variant="destructive">
          End Interview
        </Button>
      </div>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-6">
          {interview.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isSending && (
            <ChatMessage message={{ id: 'loading', role: 'assistant', content: '...' }} isLoading={true} />
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        {interview.isFinished ? (
          <PDFPrompt
            interview={interview}
            onDownloadPDF={() => {
              const qaPairs = interview.messages
                .filter((m, i, arr) => m.role === 'assistant' && arr[i + 1]?.role === 'user')
                .map((m, i, arr) => ({
                  question: m.content,
                  answer: arr[i + 1] ? arr[i + 1].content : ''
                }));
              generateInterviewPDF({
                title: `${interview.settings.topic} Interview`,
                qaPairs,
              });
            }}
            onSkip={() => router.push('/history')}
            onViewReport={() => router.push(`/report/${interviewId}`)}
          />
        ) : (
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer here..."
              className="pr-20"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={3}
            />
            <Button
              size="icon"
              className="absolute bottom-2 right-2"
              onClick={handleSendMessage}
              disabled={isSending || !inputValue.trim()}
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
// ...existing code...

function PDFPrompt({ interview, onDownloadPDF, onSkip, onViewReport }: {
  interview: any;
  onDownloadPDF: () => void;
  onSkip: () => void;
  onViewReport: () => void;
}) {
  const [showPrompt, setShowPrompt] = useState(true);
  if (!showPrompt) {
    return (
      <div className="text-center text-muted-foreground">
        This interview has ended.<br />
        <Button variant="link" onClick={onViewReport}>
          View Report
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-lg font-semibold">👉 Do you want a PDF of your Questions & Answers?</div>
      <div className="flex gap-4 mt-2">
        <Button onClick={() => { setShowPrompt(false); onDownloadPDF(); }} className="px-6 py-2 rounded-full font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-md hover:scale-105 transition-transform">Yes, Download PDF</Button>
        <Button onClick={() => { setShowPrompt(false); onSkip(); }} variant="outline" className="px-6 py-2 rounded-full font-bold">No, Go to Dashboard</Button>
      </div>
    </div>
  );
}
// ...existing code...
}
