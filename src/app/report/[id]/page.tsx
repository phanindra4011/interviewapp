import FeedbackReportClient from "@/components/interview/feedback-report-client";
import Template from "@/app/template";

export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <Template>
      <FeedbackReportClient interviewId={params.id} />
    </Template>
  );
}
