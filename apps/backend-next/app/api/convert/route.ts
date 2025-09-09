import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { saveFile, convertToPdf } from "../../../lib/storage.js";
import { fileTypeFromBuffer } from "file-type";
import { handleOptions, withCors } from "../../../lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large" }, { status: 413 });
        }

        // Validate type
        const buffer = Buffer.from(await file.arrayBuffer());
        const type = await fileTypeFromBuffer(buffer);

        if (
            !type ||
            ![
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(type.mime)
        ) {
            return NextResponse.json(
                { error: "Unsupported file type" },
                { status: 415 }
            );
        }

        // Save file to disk
        const { filePath, fileName } = await saveFile(buffer, file.name);

        // Create DB record with status PENDING
        const conversion = await prisma.conversion.create({
            data: {
                originalName: file.name,
                mimeType: type.mime,
                sizeBytes: file.size,
                status: "PENDING",
                originalPath: filePath,
            },
        });

        try {
            // Run conversion
            const pdfPath = await convertToPdf(filePath);

            // Update DB with DONE status
            const updated = await prisma.conversion.update({
                where: { id: conversion.id },
                data: {
                    status: "DONE",
                    pdfPath,
                },
            });

            return withCors(NextResponse.json({ id: updated.id, status: updated.status }));
        } catch (err: any) {
            // Update DB with FAILED status
            await prisma.conversion.update({
                where: { id: conversion.id },
                data: {
                    status: "FAILED",
                    errorMessage: err.message ?? "Unknown error during conversion",
                },
            });

            return NextResponse.json(
                { error: "Conversion failed" },
                { status: 500 }
            );
        }
    } catch (err) {
        console.error("Unexpected error", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
