import * as pdfjs from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Extracts text content from a PDF file
 * @param pdfData The PDF file data as ArrayBuffer
 * @returns The extracted text content
 */
export async function extractTextFromPdf(pdfData: ArrayBuffer): Promise<string> {
  try {
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    
    // Extract text from each page
    const textContent: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item: any) => item.str)
        .join(' ');
      
      textContent.push(text);
    }
    
    return textContent.join('\n\n');
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extracts text content from a PDF file using pdf-parse library
 * @param pdfBuffer The PDF file data as Buffer
 * @returns The extracted text content
 */
export async function extractTextFromPdfWithPdfParse(pdfBuffer: Buffer): Promise<string> {
  try {
    // In a real implementation, we would use the pdf-parse library
    // For this demo, we'll just return a placeholder
    return "This is placeholder text from a PDF document.";
  } catch (error) {
    console.error('Error extracting text from PDF with pdf-parse:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extracts metadata from a PDF document
 * @param pdf The PDF document
 * @returns The extracted metadata
 */
export async function extractPdfMetadata(pdf: PDFDocumentProxy): Promise<Record<string, any>> {
  try {
    const metadata = await pdf.getMetadata();
    return metadata.info || {};
  } catch (error) {
    console.error('Error extracting PDF metadata:', error);
    return {};
  }
} 