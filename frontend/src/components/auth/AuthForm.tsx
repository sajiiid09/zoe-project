"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

type Mode = "login" | "register";

export const AuthForm = ({ mode }: { mode: Mode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const { login, register, loading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email || !password || (mode === "register" && !fullName)) {
      setError("Please complete all required fields.");
      return;
    }

    if (mode === "login") {
      const result = await login(email, password);
      if (!result.ok) {
        setError(result.error ?? "Could not sign in.");
        return;
      }

      if (result.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }
      if (result.role === "vendor") {
        router.push("/vendor/dashboard");
        return;
      }
      if (result.role === "affiliate") {
        router.push("/affiliate/dashboard");
        return;
      }
      router.push(next);
      return;
    }

    const result = await register({ fullName, email, password, role: "customer" });
    if (!result.ok) {
      setError(result.error ?? "Could not create account.");
      return;
    }
    router.push("/");
  };

  return (
    <section className="auth-shell container">
      <form className="auth-card" onSubmit={submit}>
        <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>
        <p>{mode === "login" ? "Welcome back. Continue your shopping journey." : "Join Zoe Market for faster checkout and tracking."}</p>

        {mode === "register" ? (
          <input value={fullName} placeholder="Full name" onChange={(e) => setFullName(e.target.value)} />
        ) : null}
        <input value={email} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input value={password} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        {error ? <p className="form-error">{error}</p> : null}

        <Button disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</Button>

        <div className="auth-switch">
          {mode === "login" ? (
            <p>New to Zoe Market? <Link href="/auth/register">Create account</Link></p>
          ) : (
            <p>Already have an account? <Link href="/auth/login">Sign in</Link></p>
          )}
        </div>
        <p className="auth-hint">Demo users: customer@zoe.test / Password123!, vendor@zoe.test / Password123! (payment-required), admin@zoe.test / Password123!</p>
      </form>
    </section>
  );
};
