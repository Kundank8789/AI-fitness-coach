import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportPlanAsPDF(elementId, filename = 'plan.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Plan element not found');
    return;
  }
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
}
