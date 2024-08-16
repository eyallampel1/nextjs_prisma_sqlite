'use server';
import { db } from '@/db';
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {console} from "next/dist/compiled/@edge-runtime/primitives";
import {cookies} from "next/headers";
import * as jose from "jose";

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
    // Check the user's inputs and make sure they're valid
    const username = formData.get('username');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    console.log("FROM Server action signupAction :  username is: " + username, "password is: " + password, "confirm password is: " + confirmPassword);

    if (typeof username !== 'string' || username.length < 3) {
        return {
            message: 'username must be longer',
        };
    }
    if (typeof password !== 'string' || password.length > 10) {
        return {
            message: 'password must be shorter than 10 characters',
        };
    }
    if (password !== confirmPassword) {
        return {
            message: 'passwords do not match',
        };
    }

    const snip=await db.LoginTable.create({
        data: {
            username: username,
            password: password,
        },
    });
    console.log("user created");
    redirect('/login');

    return {
        message: '',
    };
}

export async function validateAction(
    formState,
    formData
) {
    // Check the user's inputs and make sure they're valid
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
//if loginDB is null then the user is not in the database set it to dummy value to fail the if
    if(loginDB === null){
        loginDB = {username: "dummy", password: "dummy"};
    }

    if(loginDB.password === password && loginDB.username === username){
            console.log("Login successful");

        const secret = new TextEncoder().encode(
process.env.JWT_SECRET        );
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
        }
        else{
            console.log("Login failed");
            return {
                message: 'Invalid credentials',

            };

        }

    console.log("FROM Server action validateAction :  username is: " + username, "password is: " + password);

    if (typeof username !== 'string' || username.length < 3) {

        return {
            message: 'username must be longer',

        };
    }
    if (typeof password !== 'string' || password.length > 10) {
        return {
            message: 'password must be shorter than 10 characters',
        };
    }
    return {
        message: '',
    };

}