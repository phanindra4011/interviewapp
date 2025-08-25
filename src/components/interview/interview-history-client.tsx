'use client';

import { useInterviewStore } from '@/hooks/use-interview-store';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, MessageSquare } from 'lucide-react';

export default function InterviewHistoryClient() {
  const router = useRouter();
  const interviews = useInterviewStore((state) =>
    [...state.interviews].sort((a, b) => b.createdAt - a.createdAt)
  );

  if (!interviews.length) {
    return (
      <Card className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <CardHeader>
            <div className="mx-auto bg-muted rounded-full p-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
          <CardTitle className="mt-4 text-2xl">No Interviews Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven't completed any interviews. Start one to see your history here.
          </p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Start a New Interview
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell className="font-medium">
                  {format(new Date(interview.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{interview.settings.type}</TableCell>
                <TableCell>{interview.settings.difficulty}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/report/${interview.id}`)}
                    disabled={!interview.isFinished}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
