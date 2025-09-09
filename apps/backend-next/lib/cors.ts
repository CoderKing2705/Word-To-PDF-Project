import { NextResponse } from "next/server";

/**
 * Wraps a NextResponse with CORS headers
 */
export function withCors(response: NextResponse) {
    response.headers.set("Access-Control-Allow-Origin", "*"); // allow all (change to frontend URL in prod)
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
}

/**
 * Handles OPTIONS preflight requests
 */
export function handleOptions() {
    return withCors(new NextResponse(null, { status: 204 }));
}
