import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/pdfs/:path*",           // public URL
                destination: "/output/pdfs/:path*", // your real folder
            },
        ];
    },
};

export default nextConfig;