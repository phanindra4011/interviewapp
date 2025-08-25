'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useInterviewStore } from '@/hooks/use-interview-store';
import { getInitialQuestion } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const setupSchema = z.object({
  type: z.string().min(1, 'Please select an interview type.'),
  difficulty: z.string().min(1, 'Please select a difficulty level.'),
});

type SetupFormValues = z.infer<typeof setupSchema>;

const interviewTypes = ['Behavioral', 'Technical', 'System Design', 'Product Sense'];
const difficultyLevels = ['Entry-Level', 'Mid-Level', 'Senior', 'Staff'];

export default function InterviewSetup() {
  const router = useRouter();
  const { toast } = useToast();
  const addInterview = useInterviewStore((state) => state.addInterview);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      type: '',
      difficulty: '',
    },
  });

  const onSubmit = async (data: SetupFormValues) => {
    setIsLoading(true);
    try {
      const initialResponse = await getInitialQuestion(data.type, data.difficulty);
      
      const newInterviewId = `interview_${Date.now()}`;
      
      addInterview({
        id: newInterviewId,
        createdAt: Date.now(),
        settings: data,
        messages: [
          {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: initialResponse.nextQuestion,
            feedbackOnAnswer: initialResponse.feedback,
          },
        ],
        isFinished: false,
      });

      router.push(`/interview/${newInterviewId}`);
    } catch (error) {
      console.error('Failed to start interview:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to start the interview. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interview Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {interviewTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a difficulty..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting...
            </>
          ) : (
            'Begin Interview'
          )}
        </Button>
      </form>
    </Form>
  );
}
