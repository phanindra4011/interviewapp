import ChatInterface from "@/components/interview/chat-interface";
import Template from "@/app/template";

export default async function InterviewPage({ params }: { params: { id: string } }) {
  // Await params if needed (Next.js 14+)
  const awaitedParams = await params;
  return (
    <Template>
      <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)]">
        <ChatInterface interviewId={awaitedParams.id} />
      </div>
    </Template>
  );
}
