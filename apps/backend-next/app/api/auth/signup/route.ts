import { NextRequest, NextResponse } from "next/server";
import { handleOptions, withCors } from "../../../../lib/cors";
import { generateToken, hashPassword } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
export async function OPTIONS() {
    // Handles CORS preflight
    return handleOptions();
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // 1️⃣ Check if email already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return withCors(
                NextResponse.json({ error: "User already exists" }, { status: 400 })
            );
        }

        // 2️⃣ Hash the password
        const hashed = await hashPassword(password);

        // 3️⃣ Create the user
        const user = await prisma.user.create({
            data: { email, password: hashed },
        });

        // 4️⃣ Generate JWT token
        const token = generateToken(user.id);

        // 5️⃣ Send response with CORS headers
        return withCors(
            NextResponse.json({
                token,
                user: { id: user.id, email: user.email },
            })
        );
    } catch (err) {
        console.error("Signup error:", err);
        return withCors(
            NextResponse.json({ error: "Signup failed" }, { status: 500 })
        );
    }
}
