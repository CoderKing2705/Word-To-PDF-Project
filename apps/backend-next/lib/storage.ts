import fs from "fs";
import path from "path";
import { promisify } from "util";
import libre from "libreoffice-convert";
import { spawn } from "child_process";

// Promisify LibreOffice converter
const convertAsync = promisify(libre.convertWithOptions);

const SOFFICE_PATH = "C:\Program Files\LibreOffice\program\soffice.exe";
const outputDir = path.join(process.cwd(), "output/pdfs");

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

export async function checkSoffice() {
    return new Promise<void>((resolve, reject) => {
        const child = spawn(
            "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
            ["--version"] // ← args separate
            // no {shell:true}
        );
        child.stdout.on("data", d => console.log("[soffice stdout]", d.toString()));
        child.stderr.on("data", d => console.error("[soffice stderr]", d.toString()));
        child.on("exit", code => {
            console.log("[soffice exit code]", code);
            code === 0 ? resolve() : reject(new Error("Soffice failed to run"));
        });
    });
}

/**
 * Convert Word document to PDF using LibreOffice
 */
export async function convertToPdf(filePath: string) {
    console.log("Converting file:", filePath);

    // ✅ first check that soffice runs
    await checkSoffice();

    const stats = fs.statSync(filePath);
    console.log("Size:", stats.size, "bytes");

    const file = fs.readFileSync(filePath);
    console.log("Buffer length:", file.length);

    try {
        const pdfBuffer: Buffer = await convertAsync(
            file,
            ".pdf",
            undefined,
            {
                sofficeBinaryPaths: [SOFFICE_PATH],
                // You can also tweak asyncOptions if needed:
                // asyncOptions: { times: 3, interval: 5000 }
            }
        );

        const pdfPath = filePath.replace(/\.[^/.]+$/, "") + ".pdf";
        fs.writeFileSync(pdfPath, pdfBuffer);
        console.log("Converted successfully to:", pdfPath);

        return pdfPath;
    } catch (err: any) {
        console.error("LibreOffice conversion error:", err);
        throw err;
    }
}