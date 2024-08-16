import { NextResponse } from 'next/server';
import * as jose from 'jose';
import {cookies} from "next/headers";

export async  function middleware(request,response) {
    if (request.nextUrl.pathname.startsWith('/protected')) {
        // Retrieve the JWT cookie directly
        try {
            const jwt = cookies().get('Authorization')?.value;

            // const jwt = cookies().get('Authorization')?.value;

        console.log("JWT Cookie is: ", jwt);

        if (!jwt) {
            console.log("No JWT cookie found");
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // If the JWT cookie is present, validate it
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET
        );

            const { payload } = await jose.jwtVerify(jwt, secret);
            console.log("Payload is: ", payload);
            // Proceed to the protected route
            return NextResponse.next();
        } catch (e) {
            console.log("JWT validation error: ", e);
            // Redirect to login if JWT is invalid
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Continue for all other routes
    return NextResponse.next();
}