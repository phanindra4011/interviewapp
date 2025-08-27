

"use client";
import InterviewSetup from "@/components/interview/interview-setup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoachMascot } from "@/components/icons/coach-mascot";
import { useEffect, useState } from "react";

export default function Home() {
  const [showSetup, setShowSetup] = useState(false);
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-3xl text-center animate-fadein">
        <h1 className="text-6xl font-extrabold tracking-tight text-primary">AceInterview</h1>
        {!showSetup && (
          <div className="mt-8">
            <button
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow transition-transform hover:scale-105"
              onClick={() => setShowSetup(true)}
            >
              Let's Start
            </button>
          </div>
        )}
        {showSetup && (
          <div className="mt-8">
            <Card className="w-full rounded-xl shadow bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Start a New Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <InterviewSetup />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: none; }
        }
        .animate-fadein { animation: fadein 0.6s ease-out both; }
      `}</style>
    </div>
  );
}
