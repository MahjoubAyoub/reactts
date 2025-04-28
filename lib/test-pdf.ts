import { jsPDF } from 'jspdf';

// Test function to verify jsPDF functionality
export function createTestPDF() {
  const doc = new jsPDF();
  doc.text('Hello World!', 10, 10);
  return doc;
}