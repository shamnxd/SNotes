"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Lock, LogOut, Plus, FileText, User as UserIcon } from "lucide-react";

interface HeaderUser {
  id: string;
  name: string;
  email: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<HeaderUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="w-full bg-white border-b border-[#E4E4E7] sticky top-0 z-40">
      {/* Top Brown Accent Strip */}
      <div className="h-1.5 w-full bg-[#3B2314]" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-[#FA661A] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-[#E0530C] transition-colors">
            <Lock className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#18181B]">
            SNotes
          </span>
        </Link>

        {/* Navigation & Profile Controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
                  pathname === "/dashboard"
                    ? "bg-[#FFF0E6] text-[#FA661A]"
                    : "text-[#737373] hover:text-[#18181B]"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>My Notes</span>
              </Link>

              <Link
                href="/notes/new"
                className="px-4 py-2 text-sm font-semibold text-white bg-[#FA661A] hover:bg-[#E0530C] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Note</span>
              </Link>

              <div className="h-5 w-[1px] bg-[#E4E4E7] mx-1" />

              <div className="flex items-center gap-2 text-sm font-medium text-[#18181B]">
                <div className="w-7 h-7 rounded-full bg-[#FFF0E6] text-[#FA661A] font-bold text-xs flex items-center justify-center border border-[#FFD5C0]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs text-[#737373]">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 text-[#737373] hover:text-[#EF4444] rounded-xl hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-[#737373] hover:text-[#18181B] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-[#FA661A] hover:bg-[#E0530C] rounded-xl shadow-sm transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
