import InterviewSetup from "@/components/interview/interview-setup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Welcome to AceInterview
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your personal AI-powered coach to help you ace your next interview.
            Enter an interview topic below to get started.
          </p>
        </div>
        <Card className="mx-auto w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Start a New Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <InterviewSetup />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
