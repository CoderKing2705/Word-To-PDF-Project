import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db.js";
import { handleOptions, withCors } from "../../../lib/cors.js";

export async function OPTIONS() {
    return handleOptions();
}

export async function GET() {
    try {
        const conversions = await prisma.conversion.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                originalName: true,
                mimeType: true,
                sizeBytes: true,
                status: true,
                errorMessage: true,
                pdfPath: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // ✅ Always wrap withCors
        return withCors(NextResponse.json(conversions));
    } catch (err) {
        console.error("Error fetching conversions:", err);
        return withCors(
            NextResponse.json(
                { error: "Failed to fetch conversions" },
                { status: 500 }
            )
        );
    }
}
