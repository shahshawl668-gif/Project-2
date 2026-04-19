"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ApiError, loginUser, registerUser } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heading =
    mode === "login" ? "Welcome back" : "Create your JobTracker AI account";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await registerUser(email, password);
      }

      const session = await loginUser(email, password);
      setSession(session.access_token, email);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "We couldn't complete your request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/85 p-8 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-teal-400/15 to-blue-500/10" />
      <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-teal-300">
        JobTracker AI
      </p>
      <h1 className="relative mt-3 text-3xl font-semibold text-white">{heading}</h1>
      <p className="relative mt-2 text-sm text-slate-400">
        Track applications, measure conversion, and get AI guidance on your resume.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:bg-slate-900"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:bg-slate-900"
            placeholder="Minimum 8 characters"
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:from-teal-300 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Working..."
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <Link
          href={mode === "login" ? "/register" : "/login"}
          className="font-semibold text-teal-300"
        >
          {mode === "login" ? "Create an account" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
