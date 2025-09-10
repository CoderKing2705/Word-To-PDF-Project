import { PrismaClient } from "@prisma/client";

declare global {
    // Avoid re-creating PrismaClient on every hot reload in dev
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma ??
    new PrismaClient({
        log: ["query", "error", "warn"],
    });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
