"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { SHARE_STATUS, ShareStatusType } from "@/lib/constants/statusCodes";

interface SharedNote {
  title: string;
  content: string;
  createdAt: string;
}

export default function ShareAccessPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const [status, setStatus] = useState<ShareStatusType>(SHARE_STATUS.LOADING);
  const [errorMessage, setErrorMessage] = useState("");
  const [note, setNote] = useState<SharedNote | null>(null);

  const [password, setPassword] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  const checkShareAccess = async () => {
    try {
      const res = await fetch(`/api/share/${token}`);
      const json = await res.json();

      if (json.status === SHARE_STATUS.PASSWORD_REQUIRED) {
        setStatus(SHARE_STATUS.PASSWORD_REQUIRED);
      } else if (json.status === SHARE_STATUS.SUCCESS) {
        setNote(json.data?.note || json.note);
        setStatus(SHARE_STATUS.SUCCESS);
      } else {
        setStatus(json.status || SHARE_STATUS.ERROR);
        setErrorMessage(json.message || json.error || "Unable to access share link.");
      }
    } catch (err) {
      console.error(err);
      setStatus(SHARE_STATUS.ERROR);
      setErrorMessage("Failed to connect to server.");
    }
  };

  useEffect(() => {
    checkShareAccess();
  }, [token]);

  const handleUnlockPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!password.trim()) {
      setErrorMessage("Please enter access password to unlock.");
      return;
    }

    setUnlocking(true);

    try {
      const res = await fetch(`/api/share/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();

      if (res.ok && json.status === SHARE_STATUS.SUCCESS) {
        setNote(json.data?.note || json.note);
        setStatus(SHARE_STATUS.SUCCESS);
      } else {
        setErrorMessage(json.message || json.error || "Incorrect password.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred while unlocking.");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center">
        {status === SHARE_STATUS.LOADING && (
          <div className="w-full max-w-md text-center my-auto animate-pulse space-y-4">
            <div className="h-6 bg-slate-100 rounded-full w-1/2 mx-auto" />
            <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto" />
            <div className="h-12 bg-slate-100 rounded-2xl w-full" />
          </div>
        )}

        {status === SHARE_STATUS.PASSWORD_REQUIRED && (
          <div className="w-full max-w-md my-auto">
            <div className="flex flex-col items-center text-center mb-8">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Password Protected
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Enter the access password to view this note
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form noValidate onSubmit={handleUnlockPassword} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 text-left">
                  Access Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2F8CFF] focus:ring-1 focus:ring-[#2F8CFF] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={unlocking}
                className="mt-2 w-full py-3.5 px-4 bg-[#2F8CFF] hover:bg-[#1E7BE6] text-white font-semibold text-sm rounded-full shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {unlocking ? "Unlocking..." : "Unlock Note"}
                {!unlocking && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-500">
              Want to create secret notes?{" "}
              <Link
                href="/"
                className="font-semibold text-[#2F8CFF] hover:underline"
              >
                Get started for free
              </Link>
            </div>
          </div>
        )}

        {[
          SHARE_STATUS.INVALID,
          SHARE_STATUS.REVOKED,
          SHARE_STATUS.EXPIRED,
          SHARE_STATUS.USED,
          SHARE_STATUS.ERROR,
          SHARE_STATUS.NOT_FOUND,
        ].includes(status as any) && (
          <div className="w-full max-w-md my-auto text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Link Unavailable
            </h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-sm">
              {errorMessage || "This one-time share link has already been accessed or expired."}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2F8CFF] hover:bg-[#1E7BE6] text-white font-semibold text-xs rounded-full shadow-xs transition-all cursor-pointer"
            >
              <span>Return to Home</span>
            </Link>
          </div>
        )}

        {status === SHARE_STATUS.SUCCESS && note && (
          <div className="w-full max-w-4xl self-start pt-4">
            <div className="mb-6 pb-6 border-b border-zinc-100">
              <h1 className="text-2xl md:text-3xl font-medium text-zinc-800 tracking-tight">
                {note.title}
              </h1>
              <p className="text-xs text-zinc-500 tracking-tight mt-1.5">
                Shared on {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="w-full bg-slate-50/50 border border-zinc-200 rounded-2xl p-6 font-mono text-xs md:text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed">
              {note.content}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
