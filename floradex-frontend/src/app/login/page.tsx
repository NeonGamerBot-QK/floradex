"use client";

import { useState } from "react";

type emailAndPassword = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [{ email, password }, setEmailAndPassword] = useState<emailAndPassword>({
        email: "",
        password: "",
    });

    const login = async () => {
        setLoading(true);
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const { token } = await response.json();

            // set cookie client-side
            document.cookie = `jwt=${token}; path=/; max-age=172800; secure; samesite=strict`;

            setSuccess("Logged in");
        } else {
            setSuccess("Failed");
        }
        setLoading(false);
    };

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login();
    };

    return (
        <div className="bg-olivine m-20 ml-100 mr-100 rounded-xl p-5">
            <div className="justify-self-center p-5">
                <img src="/floradex.svg" width={500} />
            </div>
            <form className="pt-5" onSubmit={onFormSubmit}>
                <div className="justify-self-center pb-5">
                    <p className="text-xl">Email</p>
                    <input
                        className="bg-white rounded text-space-cadet"
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmailAndPassword((prev) => ({ ...prev, email: e.target.value }))
                        }
                        required
                    />
                </div>
                <div className="justify-self-center">
                    <p className="text-xl">Password</p>
                    <input
                        className="bg-white rounded text-space-cadet"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setEmailAndPassword((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }
                        required
                    />
                    <div className="justify-self-center bg-space-cadet m-10 px-2 rounded">
                        <input type="submit" disabled={loading} />
                    </div>
                </div>
                {success && <p>{success}</p>}
            </form>
        </div>
    );
}
