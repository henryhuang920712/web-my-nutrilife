import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
    const token = await getToken({ req });
    
    // If no token exists, redirect to homepage
    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

// Protect specific routes
export const config = {
    matcher: ['/dashboard', '/dashboard/:path*'], // Protects /dashboard and its subroutes
};
