"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetch("/api/auth/me").then((res) => {
      if (res.ok) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const newFieldErrors: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) {
      newFieldErrors.name = "Please enter your full name.";
    }
    if (!email.trim()) {
      newFieldErrors.email = "Please enter your email address.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newFieldErrors.email = "Please enter a valid email address.";
    }
    if (!password.trim()) {
      newFieldErrors.password = "Please enter a password.";
    } else if (password.length < 6) {
      newFieldErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setError("Please fix the errors below before submitting.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || data.error || "Registration failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Go to Home</span>
          </Link>

          <div className="flex flex-col items-start text-left mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Start sharing encrypted notes securely
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Jane Doe"
                className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
                  fieldErrors.name
                    ? "border-rose-300 focus:border-rose-500 ring-1 ring-rose-500/20"
                    : "border-slate-200 focus:border-[#2F8CFF] focus:ring-1 focus:ring-[#2F8CFF]"
                }`}
              />
              {fieldErrors.name && (
                <p className="text-xs text-rose-500 font-medium mt-1.5">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
                  fieldErrors.email
                    ? "border-rose-300 focus:border-rose-500 ring-1 ring-rose-500/20"
                    : "border-slate-200 focus:border-[#2F8CFF] focus:ring-1 focus:ring-[#2F8CFF]"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-rose-500 font-medium mt-1.5">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="At least 6 characters"
                className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
                  fieldErrors.password
                    ? "border-rose-300 focus:border-rose-500 ring-1 ring-rose-500/20"
                    : "border-slate-200 focus:border-[#2F8CFF] focus:ring-1 focus:ring-[#2F8CFF]"
                }`}
              />
              {fieldErrors.password && (
                <p className="text-xs text-rose-500 font-medium mt-1.5">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 px-4 bg-[#2F8CFF] hover:bg-[#1E7BE6] text-white font-semibold text-sm rounded-full shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-left text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#2F8CFF] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
