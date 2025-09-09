import fs from 'node:fs';
import { promisify } from 'node:util';
import libre from 'libreoffice-convert';


const libreConvert = promisify(libre.convert);


export async function docToPdf(inputBuffer: Buffer): Promise<Buffer> {
    // Target extension
    const ext = '.pdf';
    return await libreConvert(inputBuffer, ext, undefined);
}