"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Lock,
  AlertTriangle,
  Check,
  Copy,
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

  // Password Unlock State
  const [password, setPassword] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [copied, setCopied] = useState(false);

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
    setUnlocking(true);
    setErrorMessage("");

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

  const copyNoteContent = () => {
    if (!note?.content) return;
    navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans">
      {/* Top Brown Accent Strip */}
      <div className="h-1.5 w-full bg-[#3B2314]" />

      {/* Header */}
      <header className="border-b border-[#E4E4E7] bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FA661A] flex items-center justify-center text-white font-bold text-lg">
              <Lock className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#18181B]">
              SNotes
            </span>
          </Link>
          <span className="text-xs font-semibold text-[#FA661A] bg-[#FFF0E6] border border-[#FFD5C0] px-3 py-1 rounded-full">
            Encrypted Note Share
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {status === SHARE_STATUS.LOADING && (
          <div className="w-full max-w-lg bg-white border border-[#E4E4E7] rounded-2xl p-8 shadow-sm text-center animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] mx-auto mb-4" />
            <div className="h-4 bg-[#F4F4F5] rounded w-1/2 mx-auto mb-2" />
            <div className="h-3 bg-[#F4F4F5] rounded w-3/4 mx-auto" />
          </div>
        )}

        {/* Password Prompt Card */}
        {status === SHARE_STATUS.PASSWORD_REQUIRED && (
          <div className="w-full max-w-md bg-white border border-[#E4E4E7] rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] text-[#FA661A] flex items-center justify-center mb-4 border border-[#FFD5C0]">
                <Lock className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#18181B] tracking-tight">
                Password Protected
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Enter the access password to view this note.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleUnlockPassword} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#18181B] uppercase tracking-wider mb-2">
                  Access Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-4 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] focus:outline-none focus:border-[#FA661A] focus:ring-1 focus:ring-[#FA661A]"
                />
              </div>

              <button
                type="submit"
                disabled={unlocking}
                className="w-full py-3 px-4 bg-[#FA661A] hover:bg-[#E0530C] text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {unlocking ? "Unlocking..." : "Unlock Note"}
                {!unlocking && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        )}

        {/* Error States */}
        {[
          SHARE_STATUS.INVALID,
          SHARE_STATUS.REVOKED,
          SHARE_STATUS.EXPIRED,
          SHARE_STATUS.USED,
          SHARE_STATUS.ERROR,
          SHARE_STATUS.NOT_FOUND,
        ].includes(status as any) && (
          <div className="w-full max-w-md bg-white border border-[#E4E4E7] rounded-2xl p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-[#18181B] mb-2">
              Link Unavailable
            </h2>
            <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
              {errorMessage || "This share link is no longer active."}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#18181B] hover:bg-black text-white font-semibold text-sm rounded-xl transition-all"
            >
              Go to Home Page
            </Link>
          </div>
        )}

        {/* Note Content Display */}
        {status === SHARE_STATUS.SUCCESS && note && (
          <div className="w-full max-w-3xl bg-white border border-[#E4E4E7] rounded-2xl p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-[#F4F4F5]">
              <div>
                <h1 className="text-2xl font-extrabold text-[#18181B] tracking-tight">
                  {note.title}
                </h1>
                <p className="text-xs text-[#737373] mt-1">
                  Shared on {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={copyNoteContent}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FA661A] bg-[#FFF0E6] border border-[#FFD5C0] hover:bg-[#FFE6D5] rounded-xl transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy Content"}</span>
              </button>
            </div>

            <div className="bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl p-6 font-mono text-sm text-[#18181B] whitespace-pre-wrap leading-relaxed">
              {note.content}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
