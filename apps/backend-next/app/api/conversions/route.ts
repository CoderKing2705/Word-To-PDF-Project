// /app/api/conversions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { handleOptions, withCors } from "../../../lib/cors";
import { verifyToken } from "../../../lib/auth";

export async function OPTIONS() {
    return handleOptions();
}

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return withCors(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return withCors(NextResponse.json({ error: "Invalid token" }, { status: 401 }));
        }
        const conversions = await prisma.conversion.findMany({
            where: { userId: decoded.userId }, // 👈 only that user’s docs
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

        return withCors(NextResponse.json(conversions));
    } catch (err) {
        console.error("Error fetching conversions:", err);
        return withCors(NextResponse.json({ error: "Failed to fetch conversions" }, { status: 500 }));
    }
}
