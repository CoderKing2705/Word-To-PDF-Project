import { NextRequest, NextResponse } from "next/server";
import { handleOptions, withCors } from "../../../../lib/cors";
import { comparePasswords, generateToken } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function OPTIONS() {
    return handleOptions();
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await comparePasswords(password, user.password))) {
            return withCors(NextResponse.json({ error: "Invalid credentials" }, { status: 401 }));
        }

        const token = generateToken(user.id);
        return withCors(NextResponse.json({ token, user: { id: user.id, email: user.email } }));
    } catch (err) {
        return withCors(NextResponse.json({ error: "Login failed" }, { status: 500 }));
    }
}
