import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInterviewPDF({ title, qaPairs }: { title: string; qaPairs: { question: string; answer: string }[] }) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text(title, 14, 20);
  autoTable(doc, {
    startY: 30,
    head: [["Question", "Answer"]],
    body: qaPairs.map((pair) => [pair.question, pair.answer]),
    styles: { cellWidth: 'wrap', fontSize: 12 },
    headStyles: { fillColor: [102, 126, 234] },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 100 },
    },
  });
  doc.save(`${title.replace(/\s+/g, '_')}_QnA.pdf`);
}
