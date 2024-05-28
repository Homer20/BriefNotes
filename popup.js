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

async function summarizeText(text) {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'API_KEY',
        },
        body: JSON.stringify({
            prompt: 'Summarize the following text:\n\n${text}',
            max_tokens: 150,
        }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}
