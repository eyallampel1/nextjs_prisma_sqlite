'use server';
import { db } from '@/db';
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as jose from "jose";
import {console} from "next/dist/compiled/@edge-runtime/primitives";

export async function validateCardntials(formstate,formData) {
    //check user input
    // const username = formData.get('username');
    // const password = formData.get('password');
    // console.log("FROM Server action validateCardntials :  username is: " + username, "password is: " + password);
//add 5 seconds delay
    await new Promise((resolve) => setTimeout(resolve, 5000));

    //check credentials against the database
    // const user = await db.LoginTable.findFirst({
    //     where: {
    //         username: username,
    //         password: password,
    //     },
    // });
    // console.log("user is: ", user);
    return {
        message: "Login successful",
    }
}

export async function signupAction(formState, formData) {
    // Extract the user's inputs
    const username = formData.get('username');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    console.log("FROM Server action signupAction :  username is: " + username, "password is: " + password, "confirm password is: " + confirmPassword);

    // Validate username
    if (typeof username !== 'string' || username.length < 5) {
        return {
            message: 'Username must be at least 5 characters long.',
        };
    }

    // Validate password
    if (typeof password !== 'string' || password.length < 8) {
        return {
            message: 'Password must be at least 8 characters long.',
        };
    }
    if (!/\d/.test(password)) {
        return {
            message: 'Password must contain at least one number.',
        };
    }
    if (!/[A-Z]/.test(password)) {
        return {
            message: 'Password must contain at least one uppercase letter.',
        };
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
        return {
            message: 'Passwords do not match.',
        };
    }

    // Check if the username already exists in the database
    const existingUser = await db.LoginTable.findFirst({
        where: {
            username: username,
        },
    });

    if (existingUser) {
        return {
            message: 'Username already taken. Please choose a different one.',
        };
    }

    // Create the new user in the database
    const newUser = await db.LoginTable.create({
        data: {
            username: username,
            password: password,
        },
    });

    console.log("User created successfully:", newUser);

    // Redirect to the login page after successful signup
    redirect('/login');

    return {
        message: '',
    };
}

export async function validateAction(formState, formData) {
    const username = formData.get('username');
    const password = formData.get('password');

    console.log("username is: ", username);
    console.log("password is: ", password);

    let loginDB = await db.LoginTable.findFirst({
        where: {
            username: username,
            password: password,
        },
    });

    console.log("loginDB is: ", loginDB);

    if (loginDB && loginDB.password === password && loginDB.username === username) {
        console.log("Login successful");

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const alg = 'HS256';

        const jwt = await new jose.SignJWT({})
            .setProtectedHeader({ alg })
            .setExpirationTime('72h')
            .setSubject(loginDB.username.toString())
            .sign(secret);

        console.log("JWT is: ", jwt);
        cookies().set("Authorization", jwt, {
            secure: true,
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            path: '/',
            sameSite: 'strict',
        });

        redirect('/protected');
    } else {
        console.log("Login failed");
        redirect('/login?error=Invalid credentials');
    }
}