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

document.getElementById('summarize').addEventListener('click', async () => {
    const fileInput = document.getElementById('upload');
    const summaryDiv = document.getElementById('summary');

    if (fileInput.files.length === 0) {
        alert('Please select a PDF file first.');
        return;
    }

    const file = fileInput.files[0];
    const fileReader = new FileReader();

    fileReader.onload = async () => {
        const pdfData = new Uint8Array(fileReader.result);
        try {
            const text = await extractTextFromPDF(pdfData);
            const summary = await summarizeText(text);
            summaryDiv.innerText = summary;
        } catch (error) {
            summaryDiv.innerText = 'An error occured while summarizing the pdf.';
            console.error(error);
        }
    };

    fileReader.readAsArrayBuffer(file);
});
