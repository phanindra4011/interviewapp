import ChatInterface from "@/components/interview/chat-interface";
import Template from "@/app/template";

export default function InterviewPage({ params }: { params: { id: string } }) {
  return (
    <Template>
      <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)]">
        <ChatInterface interviewId={params.id} />
      </div>
    </Template>
  );
}
