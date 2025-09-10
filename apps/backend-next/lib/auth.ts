import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // put in .env

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashed: string) {
    return bcrypt.compare(password, hashed);
}

export function generateToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        return null;
    }
}
