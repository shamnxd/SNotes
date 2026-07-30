"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  ArrowLeft,
  Save,
  Copy,
  Check,
  Eye,
  AlertCircle,
  Link2,
} from "lucide-react";

interface NoteShare {
  id: string;
  token: string;
  isPasswordProtected: boolean;
  isOneTime: boolean;
  isUsed: boolean;
  expiresAt?: string;
  isRevoked: boolean;
  viewCount: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  share: NoteShare | null;
}

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [sharePassword, setSharePassword] = useState("");
  const [isOneTime, setIsOneTime] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/notes/${id}`);
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const json = await res.json();
      const noteData: Note = json.data || json.note;

      setNote(noteData);
      setTitle(noteData.title);
      setContent(noteData.content);

      if (noteData.share) {
        setIsPasswordProtected(noteData.share.isPasswordProtected);
        setIsOneTime(noteData.share.isOneTime);
        if (noteData.share.expiresAt) {
          setExpiresAt(
            new Date(noteData.share.expiresAt).toISOString().slice(0, 16)
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");
    setError("");

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const json = await res.json();
      if (res.ok && json.success !== false) {
        setStatusMsg(json.message || "Note updated successfully.");
        fetchNote();
      } else {
        setError(json.message || "Failed to update note.");
      }
    } catch (err) {
      setError("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateShare = async () => {
    setStatusMsg("");
    setError("");
    try {
      const res = await fetch(`/api/notes/${id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPasswordProtected,
          password: sharePassword,
          isOneTime,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success !== false) {
        setStatusMsg(json.message || "Share link generated/updated successfully.");
        fetchNote();
      } else {
        setError(json.message || "Failed to generate share link.");
      }
    } catch (err) {
      setError("An error occurred.");
    }
  };

  const handleRevokeShare = async () => {
    setShowRevokeModal(false);
    setStatusMsg("");
    setError("");
    try {
      const res = await fetch(`/api/notes/${id}/revoke`, { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success !== false) {
        setStatusMsg(json.message || "Share link revoked.");
        fetchNote();
      } else {
        setError(json.message || "Failed to revoke share link.");
      }
    } catch (err) {
      setError("An error occurred.");
    }
  };

  const copyShareUrl = () => {
    if (!note?.share?.token) return;
    const url = `${window.location.origin}/share/${note.share.token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
          <div className="h-8 w-32 bg-slate-100 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-11 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="h-6 w-40 bg-slate-100 rounded animate-pulse" />
              <div className="h-8 bg-slate-100 rounded animate-pulse" />
              <div className="h-8 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  const hasActiveShare = note?.share?.token && !note.share.isRevoked && !(note.share.isOneTime && note.share.isUsed) && !(note.share.expiresAt && new Date(note.share.expiresAt) < new Date());

  const isLocked = !!(
    (note?.share?.isRevoked) ||
    (note?.share?.isOneTime && note?.share?.isUsed) ||
    (note?.share?.expiresAt && new Date(note.share.expiresAt) < new Date())
  );

  const lockReason = note?.share?.isRevoked
    ? { label: "Revoked", color: "text-zinc-500", bg: "bg-zinc-50 border-zinc-200" }
    : note?.share?.isOneTime && note?.share?.isUsed
    ? { label: "Used — One-time link consumed", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" }
    : note?.share?.expiresAt && new Date(note.share.expiresAt) < new Date()
    ? { label: "Expired", color: "text-rose-500", bg: "bg-rose-50 border-rose-200" }
    : null;

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header />

      {/* Main Container — same max-w-6xl as Create Note */}
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
            Edit Secret Note
          </h1>
        </div>

        {/* Success / Error Banners */}
        {statusMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{statusMsg}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* 2-Column Sidebar Layout — same as Create Note */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Editor Section (Left — Span 8) */}
          <form
            noValidate
            onSubmit={handleUpdate}
            className="lg:col-span-8 space-y-6"
          >
            <div>
              <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-2">
                Note Title
              </label>
              <input
                type="text"
                required
                value={title}
                readOnly={isLocked}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Secret API Keys & Staging Passwords"
                className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none transition-all ${
                  isLocked
                    ? "border-zinc-100 bg-zinc-50 text-zinc-500 cursor-not-allowed"
                    : "border-zinc-200 focus:border-[#2F8CFF] focus:ring-1 focus:ring-[#2F8CFF]"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-2">
                Encrypted Content
              </label>
              <textarea
                required
                rows={14}
                value={content}
                readOnly={isLocked}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type or paste your sensitive note, secret text, or code snippet here..."
                className={`w-full p-4 border rounded-2xl text-xs font-mono text-zinc-800 placeholder-zinc-400 outline-none transition-all leading-relaxed ${
                  isLocked
                    ? "bg-zinc-50 border-zinc-100 text-zinc-500 cursor-not-allowed"
                    : "bg-slate-50/50 border-zinc-200 focus:border-[#2F8CFF] focus:bg-white focus:ring-1 focus:ring-[#2F8CFF]"
                }`}
              />
            </div>

            {!isLocked && (
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#2F8CFF] hover:bg-[#1E7BE6] text-white text-xs font-medium rounded-full transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-5 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white hover:bg-slate-50 transition-all rounded-full cursor-pointer border border-zinc-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          {/* Right Sidebar — same structure as Create Note */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h2 className="text-sm font-medium text-zinc-800 tracking-tight">
                Sharing &amp; Security Settings
              </h2>
            </div>

            {lockReason && (
              <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${lockReason.bg} ${lockReason.color}`}>
                <span className="text-base leading-none">●</span>
                <span>{lockReason.label}</span>
              </div>
            )}

            {hasActiveShare && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-800">Active Share Link</span>
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                    <Eye className="w-3.5 h-3.5 text-zinc-400" />
                    {note?.share?.viewCount || 0} views
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-zinc-200 rounded-xl">
                  <Link2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="text-[11px] font-mono text-zinc-500 truncate flex-1">
                    /share/{note?.share?.token}
                  </span>
                  <button
                    onClick={copyShareUrl}
                    className="p-1 text-[#2F8CFF] hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                    title="Copy Share Link"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setShowRevokeModal(true)}
                  className="w-full py-2 px-3 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors border border-rose-200 cursor-pointer"
                >
                  Revoke Share Link
                </button>
              </div>
            )}

            {!hasActiveShare && !lockReason && !note?.share && (
              <p className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                No share link yet. Configure options below to generate one.
              </p>
            )}

            {/* Divider */}
            <div className="space-y-4 pt-2 border-t border-zinc-100">
              {/* One-Time Burn Switch */}
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

              {/* Password Protection Switch */}
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
                  <input
                    type="password"
                    value={sharePassword}
                    onChange={(e) => setSharePassword(e.target.value)}
                    placeholder="Set access password"
                    className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs outline-none transition-all focus:border-[#2F8CFF] focus:ring-1 focus:ring-[#2F8CFF]"
                  />
                )}
              </div>

              {/* Expiration Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-800">
                  Expiration Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  min={getMinDateTime()}
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 outline-none transition-all focus:border-[#2F8CFF] focus:ring-1 focus:ring-[#2F8CFF]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleGenerateShare}
                className="w-full py-2.5 px-4 bg-[#2F8CFF] hover:bg-[#1E7BE6] text-white text-xs font-medium rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>
                  {isLocked
                    ? "Reopen Link"
                    : hasActiveShare
                    ? "Update Share Link"
                    : "Generate Share Link"}
                </span>
              </button>
            </div>
          </aside>
        </div>
      </main>

      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowRevokeModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-zinc-900">Revoke Share Link?</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Anyone with the current link will immediately lose access. You can generate a new share link anytime.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleRevokeShare}
                className="flex-1 py-2 px-4 bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium rounded-full transition-all cursor-pointer"
              >
                Yes, Revoke
              </button>
              <button
                onClick={() => setShowRevokeModal(false)}
                className="flex-1 py-2 px-4 bg-white hover:bg-slate-50 text-zinc-700 text-xs font-medium rounded-full border border-zinc-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
