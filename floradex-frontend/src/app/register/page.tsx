"use client";

import {cookies} from "next/headers"
import {useState} from "react";
import Link from "next/link";

type emailAndPassword = {
    email: string;
    password: string;
}

export default function RegisterPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean | string | undefined>(undefined);

    const [{email, password}, setEmailAndPassword] = useState<emailAndPassword>({email: "", password: ""});

    const register = async () => {
        const response = await fetch("/register", {
            method: "POST",
            body: JSON.stringify({email, password})
        })

        if (response.status === 201) {
            setSuccess(true);
        } else if (response.status === 400 && await response.text()) {
            setSuccess(false);
        }

        setLoading(false);
    }

    const onFormSubmit = () => {
        setLoading(true);
        register()
    }

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (success) {
        return (
            <div>
                account creation success!
                please sign in with your new credentials <Link href={"/login"} className={"underline"}>here</Link>
            </div>
        )
    }

    return (
        <div>
            <form>
                <input type={"email"} name={"email"}
                       onChange={(e) => setEmailAndPassword(prev => ({...prev, email: e.target.value}))}
                       required/>
                <input type={"password"} name={"password"}
                       onChange={(e) => setEmailAndPassword(prev => ({...prev, password: e.target.value}))}
                       required/>
                <input type={"submit"}/>
            </form>
        </div>
    )
}