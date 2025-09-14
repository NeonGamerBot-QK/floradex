"use client";

import { useState } from "react";
import Link from "next/link";

type emailAndPassword = {
  email: string;
  password: string;
};

export default function RegisterPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | string | undefined>(
    undefined,
  );

  const [{ email, password }, setEmailAndPassword] = useState<emailAndPassword>(
    { email: "", password: "" },
  );

  const register = async () => {
    const response = await fetch("/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 201) {
      setSuccess(true);
    } else if (response.status === 400 && (await response.text())) {
      setSuccess(false);
    }

    setLoading(false);
  };

  const onFormSubmit = () => {
    setLoading(true);
    register();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (success) {
    return (
      <div>
        account creation success! please sign in with your new credentials{" "}
        <Link href={"/login"} className={"underline"}>
          here
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-olivine m-20 ml-100 mr-100 rounded-xl p-5">
      <div className="justify-self-center p-5">
        <img src="/floradex.svg" width={500}></img>
      </div>
      <form className="pt-5" onSubmit={onFormSubmit}>
        <div className={"justify-self-center pb-5"}>
          <p className={"text-xl"}>Email</p>
          <input
            className="bg-white rounded text-space-cadet"
            type={"email"}
            name={"email"}
            onChange={(e) =>
              setEmailAndPassword((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className={"justify-self-center"}>
          <p className={"text-xl"}>Password</p>
          <input
            className="bg-white rounded text-space cadet"
            type={"password"}
            name={"password"}
            onChange={(e) =>
              setEmailAndPassword((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
          />
          <div className="justify-self-center bg-space-cadet m-10 px-2 rounded">
            <input type={"submit"} />
          </div>
        </div>
      </form>
    </div>
  );
}
