"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { ArrowLeft, Save, Lock, Zap, Clock, AlertCircle } from "lucide-react";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Share Configuration Options
  const [enableShare, setEnableShare] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [sharePassword, setSharePassword] = useState("");
  const [isOneTime, setIsOneTime] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    if (enableShare && isPasswordProtected && !sharePassword.trim()) {
      setError("Please set an access password for password protection.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Note
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

      // 2. Generate Share Link if enabled
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
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#737373] hover:text-[#18181B] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-[#18181B] tracking-tight mb-6">
            Create New Note
          </h1>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#18181B] uppercase tracking-wider mb-2">
                Note Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Server API Credentials & Access Tokens"
                className="w-full px-4 py-3 bg-white border border-[#E4E4E7] rounded-xl text-sm font-medium text-[#18181B] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FA661A] focus:ring-1 focus:ring-[#FA661A] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18181B] uppercase tracking-wider mb-2">
                Note Content
              </label>
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your sensitive note, secret text, or code snippet here..."
                className="w-full px-4 py-3 bg-white border border-[#E4E4E7] rounded-xl text-sm font-mono text-[#18181B] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FA661A] focus:ring-1 focus:ring-[#FA661A] transition-all leading-relaxed"
              />
            </div>

            {/* Share Configuration Section */}
            <div className="pt-6 border-t border-[#E4E4E7]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#18181B]">
                    Share Options
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Generate a share link with optional security rules
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableShare}
                    onChange={(e) => setEnableShare(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#E4E4E7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FA661A]" />
                </label>
              </div>

              {enableShare && (
                <div className="p-5 rounded-2xl bg-[#FAFAFC] border border-[#E4E4E7] flex flex-col gap-4 mt-4">
                  {/* Password Protection */}
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#18181B]">
                      <input
                        type="checkbox"
                        checked={isPasswordProtected}
                        onChange={(e) => setIsPasswordProtected(e.target.checked)}
                        className="rounded accent-[#FA661A]"
                      />
                      <Lock className="w-4 h-4 text-[#FA661A]" />
                      <span>Password Protect Share Link</span>
                    </label>

                    {isPasswordProtected && (
                      <input
                        type="password"
                        value={sharePassword}
                        onChange={(e) => setSharePassword(e.target.value)}
                        placeholder="Set custom access password"
                        className="ml-6 px-4 py-2 bg-white border border-[#E4E4E7] rounded-xl text-sm focus:outline-none focus:border-[#FA661A]"
                      />
                    )}
                  </div>

                  {/* One-Time Expiration */}
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#18181B]">
                    <input
                      type="checkbox"
                      checked={isOneTime}
                      onChange={(e) => setIsOneTime(e.target.checked)}
                      className="rounded accent-[#FA661A]"
                    />
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span>One-Time Link (Self-destructs after 1 view)</span>
                  </label>

                  {/* Date Expiration */}
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#18181B]">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Set Expiration Date (Optional)</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="px-4 py-2 bg-white border border-[#E4E4E7] rounded-xl text-sm text-[#18181B] focus:outline-none focus:border-[#FA661A]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 text-sm font-semibold text-[#737373] hover:text-[#18181B] bg-white border border-[#E4E4E7] rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#FA661A] hover:bg-[#E0530C] rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Save Note"}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
