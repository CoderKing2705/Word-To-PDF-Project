import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./../../../../../lib/db.js";
import fs from "fs";
import { handleOptions, withCors } from "../../../../../lib/cors.js";

export async function OPTIONS() {
    return handleOptions();
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const record = await prisma.conversion.findUnique({
        where: { id: params.id }
    });

    if (!record) {
        return withCors(NextResponse.json({ error: "Not found" }, { status: 404 }));
    }

    try {
        const fileBuffer = fs.readFileSync(record.pdfPath);
        const res = new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${record.originalName.replace(/\.[^/.]+$/, "")}.pdf"`
            }
        });
        return withCors(res);
    } catch (err) {
        return withCors(NextResponse.json({ error: "File missing" }, { status: 500 }));
    }
}
