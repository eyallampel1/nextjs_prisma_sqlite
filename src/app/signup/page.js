'use client';
import { useFormState } from "react-dom";
import {signupAction} from "@/actions";




export default function SignupPage() {

    const [formState, action] = useFormState(signupAction, {
        message: '',
    });

    return (
        <div>
            <h1>Sign Up</h1>
            <form action={action}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            {formState.message && <div>{formState.message}</div>}

                </div>

    );
}