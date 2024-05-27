// Importing the library
import {PDFDocument} from 'pdf-lib';

async function extractTextFromPDF(pdfData) {
    const pdfDof = await PDFDocument.load(pdfData);
    let text = '';

    const pages = pdfDoc.getPages();
    for (const page of pages) {
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ');
    }

    return text;
}