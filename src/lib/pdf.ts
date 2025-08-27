import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInterviewPDF({ title, qaPairs }: { title: string; qaPairs: { question: string; answer: string }[] }) {
  const doc = new jsPDF();

  // Cover/title page
  doc.setFontSize(26);
  doc.setTextColor(40, 40, 80);
  doc.text(title, 105, 50, { align: 'center' });
  doc.setFontSize(16);
  doc.setTextColor(80, 80, 80);
  doc.text('Interview Questions & Answers', 105, 65, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 75, { align: 'center' });
  doc.addPage();

  // Table of Q&A
  autoTable(doc, {
    startY: 20,
    head: [["Question", "Answer"]],
    body: qaPairs.map((pair) => [pair.question, pair.answer]),
    styles: { cellWidth: 'wrap', fontSize: 12, valign: 'top', lineColor: [200,200,200], lineWidth: 0.1 },
    headStyles: { fillColor: [102, 126, 234], textColor: 255, fontStyle: 'bold', fontSize: 13 },
    alternateRowStyles: { fillColor: [240, 244, 255] },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: 'bold', textColor: [44,62,80] },
      1: { cellWidth: 110, textColor: [44,62,80] },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Add page number at the bottom
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(10);
      doc.setTextColor(150);
  doc.text(`Page ${doc.getNumberOfPages()}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
    },
  });

  doc.save(`${title.replace(/\s+/g, '_')}_QnA.pdf`);
}
