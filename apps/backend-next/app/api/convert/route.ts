import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { saveFile, convertToPdf } from "../../../lib/storage";
import { fileTypeFromBuffer } from "file-type";
import { handleOptions, withCors } from "../../../lib/cors";

// 👇 this handles the preflight automatically
export async function OPTIONS() {
    return handleOptions();
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return withCors(
                NextResponse.json({ error: "No file uploaded" }, { status: 400 })
            );
        }

        // validate
        if (file.size > 10 * 1024 * 1024) {
            return withCors(
                NextResponse.json({ error: "File too large" }, { status: 413 })
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const type = await fileTypeFromBuffer(buffer);

        if (
            !type ||
            ![
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(type.mime)
        ) {
            return withCors(
                NextResponse.json({ error: "Unsupported file type" }, { status: 415 })
            );
        }

        const { filePath } = await saveFile(buffer, file.name);

        const conversion = await prisma.conversion.create({
            data: {
                originalName: file.name,
                mimeType: type.mime,
                sizeBytes: file.size,
                status: "PENDING",
                originalPath: filePath,
            },
        });

        // conversion
        const pdfPath = await convertToPdf(filePath);

        const updated = await prisma.conversion.update({
            where: { id: conversion.id },
            data: {
                status: "DONE",
                pdfPath,
            },
        });

        return withCors(
            NextResponse.json({ id: updated.id, status: updated.status })
        );
    } catch (err: any) {
        console.error("Unexpected error in /convert:", err);
        return withCors(
            NextResponse.json(
                { error: "Internal server error", details: err.message },
                { status: 500 }
            )
        );
    }
}

