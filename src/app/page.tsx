

"use client";
import InterviewSetup from "@/components/interview/interview-setup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoachMascot } from "@/components/icons/coach-mascot";
import { useEffect, useState } from "react";

export default function Home() {
  // Simulate user name (replace with real auth logic if available)
  const [userName, setUserName] = useState<string | null>(null);
  useEffect(() => {
    // Example: fetch user name from localStorage or API
    setUserName(localStorage.getItem("userName") || null);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <div className="container mx-auto max-w-4xl py-12">
        <div className="flex flex-col md:flex-row items-center gap-12 animate-fadein">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg font-sans mb-2">
              {userName ? `👋 Welcome back, ${userName}!` : "Welcome to AceInterview"}
            </h1>
            <p className="mt-3 text-lg text-white/80 font-sans">
              Your personal AI-powered coach to help you ace your next interview.<br />
              <span className="text-base text-white/60">Enter an interview topic below to get started.</span>
            </p>
            <div className="mt-8 max-w-lg mx-auto md:mx-0">
              <Card className="w-full rounded-xl shadow-2xl bg-white/90 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-primary font-sans">Start a New Interview</CardTitle>
                </CardHeader>
                <CardContent>
                  <InterviewSetup />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <CoachMascot className="w-[320px] h-[320px] drop-shadow-2xl animate-fadein delay-200" />
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: none; }
        }
        .animate-fadein {
          animation: fadein 1s cubic-bezier(0.4,0,0.2,1) both;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
