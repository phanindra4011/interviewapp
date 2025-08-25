'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { InterviewMessage } from '@/lib/types';
import { Bot, User, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface ChatMessageProps {
  message: InterviewMessage;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn('flex items-start gap-4', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <Avatar className="h-10 w-10 border">
        <AvatarImage />
        <AvatarFallback className={cn(isUser ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
          {isUser ? <User /> : <Bot />}
        </AvatarFallback>
      </Avatar>
      <div className={cn("flex-1 space-y-2", isUser ? "text-right" : "text-left")}>
        <Card className={cn(isUser ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
          <CardContent className="p-4">
             {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </CardContent>
        </Card>
        {!isUser && message.feedbackOnAnswer && !isLoading && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4" />
                  Quick Feedback
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-left text-sm text-muted-foreground">
                {message.feedbackOnAnswer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
}
