import { readFile } from 'node:fs/promises';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const data = await readFile(filePath);

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(data),
  }).promise;

  let text = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const content = await page.getTextContent();

    text += content.items.map((item: any) => item.str).join(' ') + '\n';
  }

  return text;
}
