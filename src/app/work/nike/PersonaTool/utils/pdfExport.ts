import { jsPDF } from "jspdf";
import { Message } from "../types";

export const exportToPdf = (messages: Message[], title: string, filename: string) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = 170;
  let y = 20;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title.toUpperCase(), margin, y);
  y += 8;

  // Metadata
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Nike Brand Research Intelligence Report | Generated: ${new Date().toLocaleString()}`, margin, y);
  y += 15;

  // Reset color
  doc.setTextColor(0);

  messages.forEach((msg) => {
    // Identify role
    let roleName = msg.role === 'user' ? 'NIKE MODERATOR' : 'SEGMENT';
    if (msg.senderName) {
        roleName = msg.senderName.toUpperCase();
    }
    
    // Header: Role
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(roleName, margin, y);
    y += 5;
    
    // Content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    // Split text to wrap
    const splitText = doc.splitTextToSize(msg.content, maxWidth);
    
    // Check for page break
    const textHeight = splitText.length * 5;
    if (y + textHeight + 10 > pageHeight - margin) {
        doc.addPage();
        y = 20;
    }
    
    doc.text(splitText, margin, y);
    
    y += textHeight + 10; // Spacing for next message
  });

  // Ensure extension
  const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(finalFilename);
};