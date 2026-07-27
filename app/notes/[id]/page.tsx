"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  ArrowLeft,
  Save,
  Share2,
  Copy,
  Check,
  Eye,
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

  // Share link config state
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [sharePassword, setSharePassword] = useState("");
  const [isOneTime, setIsOneTime] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

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

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const json = await res.json();
      if (res.ok && json.success !== false) {
        setStatusMsg(json.message || "Note updated successfully");
        fetchNote();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateShare = async () => {
    setStatusMsg("");
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
        setStatusMsg(json.message || "Share link generated/updated successfully");
        fetchNote();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevokeShare = async () => {
    if (!confirm("Are you sure you want to revoke this share link?")) return;

    try {
      const res = await fetch(`/api/notes/${id}/revoke`, { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success !== false) {
        setStatusMsg(json.message || "Share link revoked.");
        fetchNote();
      }
    } catch (err) {
      console.error(err);
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
      <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
          <div className="h-64 bg-white border border-[#E4E4E7] rounded-2xl animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#737373] hover:text-[#18181B] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {statusMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Note Editor */}
          <div className="md:col-span-2 bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#18181B] mb-6">
              Edit Note
            </h2>

            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#18181B] uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#FA661A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18181B] uppercase tracking-wider mb-2">
                  Content
                </label>
                <textarea
                  required
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-sm font-mono focus:outline-none focus:border-[#FA661A]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="self-end px-5 py-2.5 bg-[#FA661A] hover:bg-[#E0530C] text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </form>
          </div>

          {/* Share Link Management Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-[#18181B] flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#FA661A]" />
                  <span>Share Manager</span>
                </h3>
                <span className="flex items-center gap-1 text-xs font-bold text-[#18181B]" title="Total successful views">
                  <Eye className="w-3.5 h-3.5 text-[#FA661A]" />
                  <span>{note?.share?.viewCount || 0} views</span>
                </span>
              </div>

              {note?.share?.token && !note.share.isRevoked ? (
                <div className="flex flex-col gap-4">
                  <div className="p-3 bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl flex items-center justify-between">
                    <span className="text-xs font-mono text-[#737373] truncate">
                      /share/{note.share.token}
                    </span>
                    <button
                      onClick={copyShareUrl}
                      className="p-1.5 text-[#FA661A] hover:bg-[#FFF0E6] rounded-lg transition-colors"
                      title="Copy Share Link"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    onClick={handleRevokeShare}
                    className="w-full py-2 px-3 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
                  >
                    Revoke Share Link
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#737373] mb-4">
                  No active share link. Configure options below to generate a new share link.
                </p>
              )}

              {/* Configure Share Settings */}
              <div className="mt-6 pt-4 border-t border-[#E4E4E7] flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                  Link Configuration
                </h4>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#18181B]">
                  <input
                    type="checkbox"
                    checked={isPasswordProtected}
                    onChange={(e) => setIsPasswordProtected(e.target.checked)}
                    className="accent-[#FA661A]"
                  />
                  <span>Password Protect</span>
                </label>

                {isPasswordProtected && (
                  <input
                    type="password"
                    value={sharePassword}
                    onChange={(e) => setSharePassword(e.target.value)}
                    placeholder="New password"
                    className="px-3 py-1.5 bg-white border border-[#E4E4E7] rounded-xl text-xs"
                  />
                )}

                <label className="flex items-center gap-2 text-xs font-semibold text-[#18181B]">
                  <input
                    type="checkbox"
                    checked={isOneTime}
                    onChange={(e) => setIsOneTime(e.target.checked)}
                    className="accent-[#FA661A]"
                  />
                  <span>One-Time Link</span>
                </label>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#737373]">
                    Expiration Date
                  </label>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#E4E4E7] rounded-xl text-xs"
                  />
                </div>

                <button
                  onClick={handleGenerateShare}
                  className="w-full py-2 px-3 bg-[#FA661A] hover:bg-[#E0530C] text-white font-semibold text-xs rounded-xl shadow-sm transition-all mt-2"
                >
                  Generate / Save Share Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
