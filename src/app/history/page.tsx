import InterviewHistoryClient from "@/components/interview/interview-history-client";
import Template from "@/app/template";

export default function HistoryPage() {
  return (
    <Template>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview History</h1>
          <p className="text-muted-foreground">
            Review your past interviews and track your progress.
          </p>
        </div>
        <InterviewHistoryClient />
      </div>
    </Template>
  );
}
