import fs from "fs";
import path from "path";
import { promisify } from "util";
import libre from "libreoffice-convert";

// Promisify LibreOffice converter
const convertAsync = promisify(libre.convert);

// Folder where we’ll save uploaded + converted files
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Save the uploaded Word file to disk
 */
export async function saveFile(buffer: Buffer, originalName: string) {
    const uniqueName = `${Date.now()}-${originalName}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);
    fs.writeFileSync(filePath, buffer);
    return { filePath, fileName: uniqueName };
}

/**
 * Convert Word document to PDF using LibreOffice
 */
export async function convertToPdf(filePath: string) {
    const file = fs.readFileSync(filePath);
    const pdfBuffer = await convertAsync(file, ".pdf", undefined);

    const pdfPath = filePath.replace(/\.[^/.]+$/, "") + ".pdf";
    fs.writeFileSync(pdfPath, pdfBuffer);
    return pdfPath;
}
