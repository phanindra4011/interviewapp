'use client';

import { useState, useRef, useEffect } from 'react';
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
      const lastAssistantMessage = interview.messages
        .filter((m) => m.role === 'assistant')
        .pop();
        
      if (!lastAssistantMessage) {
        throw new Error("Could not find the last question from the assistant.");
      }

      const response = await getNextQuestion(
        interview.settings.topic,
        interview.settings.difficulty,
        lastAssistantMessage.content,
        userMessage.content
      );

      const assistantMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant' as const,
        content: response.nextQuestion,
        feedbackOnAnswer: response.feedback,
      };

      updateInterview(interviewId, {
        messages: [...updatedMessages, assistantMessage],
      });
    } catch (error) {
      console.error('Failed to get next question:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get the next question. Please try again.',
      });
      // Optionally remove the user message if the API call fails
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
        <div className='flex items-center gap-4'>
            <h2 className="text-xl font-semibold capitalize">
            {interview.settings.topic} Interview
            </h2>
            <Badge variant="outline" className='capitalize'>{interview.settings.difficulty}</Badge>
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
             <ChatMessage message={{id: 'loading', role: 'assistant', content: '...'}} isLoading={true} />
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        {interview.isFinished ? (
          <div className="text-center text-muted-foreground">
            This interview has ended.
            <Button variant="link" onClick={() => router.push(`/report/${interviewId}`)}>
                View Report
            </Button>
          </div>
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
}
