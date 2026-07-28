"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { LogOut } from "lucide-react";

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
      .then((resJson) => {
        if (resJson && resJson.success !== false) {
          const userData = resJson.data || resJson.user;
          if (userData) {
            setUser(userData);
          }
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
      console.error("Logout Error:", err);
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group shrink-0">
          <Logo className="w-8 h-8 transition-transform group-hover:scale-105" fill="#2F8CFF" />
          <span className="text-lg font-semibold tracking-tight text-slate-900 leading-none">
            SNotes
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
              title="Log out of SNotes"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2F8CFF] hover:bg-[#1E7BE6] rounded-full shadow-xs transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
