"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  ArrowLeft,
  Save,
  AlertCircle,
} from "lucide-react";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [enableShare, setEnableShare] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [sharePassword, setSharePassword] = useState("");
  const [isOneTime, setIsOneTime] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    content?: string;
    password?: string;
    expiresAt?: string;
  }>({});

  React.useEffect(() => {
    fetch("/api/auth/me").then((res) => {
      if (res.status === 401) {
        router.push("/login?callbackUrl=/notes/new");
      }
    });
  }, [router]);

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const newFieldErrors: {
      title?: string;
      content?: string;
      password?: string;
      expiresAt?: string;
    } = {};

    if (!title.trim()) {
      newFieldErrors.title = "Please enter a title for your secret note.";
    }
    if (!content.trim()) {
      newFieldErrors.content = "Please enter note content.";
    }
    if (enableShare && isPasswordProtected && !sharePassword.trim()) {
      newFieldErrors.password = "Please set an access password for protection.";
    }
    if (enableShare && expiresAt) {
      const selectedDate = new Date(expiresAt);
      if (selectedDate <= new Date()) {
        newFieldErrors.expiresAt = "Expiration date and time must be in the future.";
      }
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const noteRes = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const noteJson = await noteRes.json();
      if (!noteRes.ok || noteJson.success === false) {
        throw new Error(noteJson.message || noteJson.error || "Failed to create note");
      }

      const createdNote = noteJson.data || noteJson.note;
      const noteId = createdNote.id;

      if (enableShare) {
        await fetch(`/api/notes/${noteId}/share`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isPasswordProtected,
            password: sharePassword,
            isOneTime,
            expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          }),
        });
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
      <Header />

      {/* Main Container - Matched to Homepage Max Width (max-w-6xl mx-auto px-6) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to My Notes</span>
          </Link>

          <h1 className="text-xl font-medium text-zinc-800 tracking-tight">
            Create Secret Note
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* 2-Column Sidebar Layout with noValidate */}
        <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Editor Section (Left - Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-2">
                Note Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (fieldErrors.title) setFieldErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="e.g. Secret API Keys & Staging Passwords"
                className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none transition-all ${
                  fieldErrors.title
                    ? "border-rose-300 focus:border-rose-500 ring-1 ring-rose-500/20"
                    : "border-zinc-200 focus:border-[#2F8CFF] focus:ring-1 focus:ring-[#2F8CFF]"
                }`}
              />
              {fieldErrors.title && (
                <p className="text-xs text-rose-500 font-medium mt-1.5">{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-2">
                Encrypted Content
              </label>
              <textarea
                rows={14}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (fieldErrors.content) setFieldErrors((prev) => ({ ...prev, content: undefined }));
                }}
                placeholder="Type or paste your sensitive note, secret text, or code snippet here..."
                className={`w-full p-4 bg-slate-50/50 border rounded-2xl text-xs font-mono text-zinc-800 placeholder-zinc-400 outline-none transition-all leading-relaxed ${
                  fieldErrors.content
                    ? "border-rose-300 focus:border-rose-500 ring-1 ring-rose-500/20"
                    : "border-zinc-200 focus:border-[#2F8CFF] focus:bg-white focus:ring-1 focus:ring-[#2F8CFF]"
                }`}
              />
              {fieldErrors.content && (
                <p className="text-xs text-rose-500 font-medium mt-1.5">{fieldErrors.content}</p>
              )}
            </div>
          </div>

          {/* Right Sidebar Controls Panel (Span 4) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h2 className="text-sm font-medium text-zinc-800 tracking-tight">
                Sharing & Security Settings
              </h2>
            </div>

            {/* Toggle Share Link */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-zinc-800 block">Generate Share Link</span>
                <span className="text-[11px] text-zinc-500 block">Allow access via link</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={enableShare}
                  onChange={(e) => setEnableShare(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2F8CFF]" />
              </label>
            </div>

            {enableShare && (
              <div className="space-y-4 pt-2 border-t border-zinc-100">
                {/* One-Time Burn Switch Option */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-zinc-800 block">One-Time Burn Link</span>
                    <p className="text-[11px] text-zinc-500 leading-snug">
                      Permanently self-destruct after 1 view.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isOneTime}
                      onChange={(e) => setIsOneTime(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2F8CFF]" />
                  </label>
                </div>

                {/* Password Protection Switch Option */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-medium text-zinc-800 block">Password Protection</span>
                      <p className="text-[11px] text-zinc-500 leading-snug">
                        Require a password to unlock note.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={isPasswordProtected}
                        onChange={(e) => setIsPasswordProtected(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2F8CFF]" />
                    </label>
                  </div>

                  {isPasswordProtected && (
                    <div>
                      <input
                        type="password"
                        value={sharePassword}
                        onChange={(e) => {
                          setSharePassword(e.target.value);
                          if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        placeholder="Set access password"
                        className={`w-full px-3.5 py-2 bg-white border rounded-xl text-xs outline-none transition-all ${
                          fieldErrors.password
                            ? "border-rose-300 focus:border-rose-500 ring-1 ring-rose-500/20"
                            : "border-zinc-200 focus:border-[#2F8CFF] focus:ring-1 focus:ring-[#2F8CFF]"
                        }`}
                      />
                      {fieldErrors.password && (
                        <p className="text-xs text-rose-500 font-medium mt-1">{fieldErrors.password}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Expiration Date with Past Date Prevention */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-800">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    min={getMinDateTime()}
                    value={expiresAt}
                    onChange={(e) => {
                      setExpiresAt(e.target.value);
                      if (fieldErrors.expiresAt) setFieldErrors((prev) => ({ ...prev, expiresAt: undefined }));
                    }}
                    className={`w-full px-3.5 py-2 bg-white border rounded-xl text-xs text-zinc-800 outline-none transition-all ${
                      fieldErrors.expiresAt
                        ? "border-rose-300 focus:border-rose-500 ring-1 ring-rose-500/20"
                        : "border-zinc-200 focus:border-[#2F8CFF] focus:ring-1 focus:ring-[#2F8CFF]"
                    }`}
                  />
                  {fieldErrors.expiresAt && (
                    <p className="text-xs text-rose-500 font-medium mt-1">{fieldErrors.expiresAt}</p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#2F8CFF] hover:bg-[#1E7BE6] text-white text-xs font-medium rounded-full transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{loading ? "Saving Note..." : "Save & Share Note"}</span>
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-2 px-4 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white hover:bg-slate-50 transition-all text-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}
