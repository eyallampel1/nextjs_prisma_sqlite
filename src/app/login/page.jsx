'use client'
import { useEffect, useState } from 'react';
import Link from "next/link";
import { redirect } from "next/navigation";
import { useFormState } from "react-dom";
import { validateAction } from "@/actions";

export default function LoginForm() {
    const [formState, action2] = useFormState(validateAction,
         {
        message: '',
    });


    return (
        <form action={action2} >
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Log In</button>
            <br></br>
            {/*{formState.message && <div>{formState.message}</div>}*/}
        </form>
    );
}