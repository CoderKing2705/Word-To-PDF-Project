import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import fs from "fs/promises";
import path from "path";
import { handleOptions, withCors } from "../../../../../lib/cors";


export async function OPTIONS() {
    return handleOptions();
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Find conversion in DB
        const conversion = await prisma.conversion.findUnique({
            where: { id },
        });

        if (!conversion) {
            return withCors(NextResponse.json({ error: "Not found" }, { status: 404 }));
        }

        if (conversion.status !== "DONE" || !conversion.pdfPath) {
            return withCors(NextResponse.json(
                { error: "File not available" },
                { status: 400 }
            ));
        }

        const pdfPath = path.resolve(conversion.pdfPath);

        // Read file as Buffer
        const fileBuffer = await fs.readFile(pdfPath);

        // Convert Buffer → Uint8Array (compatible with NextResponse)
        const fileUint8Array = new Uint8Array(fileBuffer);

        const res = new NextResponse(fileUint8Array, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${conversion.originalName.replace(/\.[^/.]+$/, "")}.pdf"`,
            },
        });
        return withCors(res);
    } catch (err) {
        console.error("Download error:", err);
        return withCors(NextResponse.json(
            { error: "Failed to download file" },
            { status: 500 }
        ));
    }
}
