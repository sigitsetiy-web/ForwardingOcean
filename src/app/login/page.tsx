"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/use-current-user";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUserStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      setUser(data.user);
      localStorage.setItem("fms_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #003B62 0%, #0070F2 50%, #003B62 100%)" }}>
      {/* Left Half — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute bottom-32 right-16 h-60 w-60 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-1/4 h-20 w-20 rounded-full bg-white/10" />

        <div className="relative z-10 text-center px-12">
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-4">Powered by</p>
          <h1 className="text-4xl font-bold text-white mb-2">Wasilah Digital System</h1>
          <div className="h-1 w-20 mx-auto rounded-full my-6" style={{ background: "#F59E0B" }} />
          <h2 className="text-2xl font-semibold text-white/90 mb-3">Welcome to KayOcean Forwarding</h2>
          <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
            Sistem manajemen forwarding terintegrasi untuk mengelola seluruh alur kerja perusahaan jasa freight forwarding — dari quotation hingga invoice.
          </p>

          {/* Feature highlights */}
          <div className="mt-10 grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-white/70">Sales Quotation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-white/70">Job Order</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-white/70">Custom Clearance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-white/70">AR / AP Invoice</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-white/70">Accurate Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-white/70">Real-time Chat</span>
            </div>
          </div>
        </div>

        <p className="absolute bottom-6 text-xs text-white/30">
          © 2026 Wasilah Digital Sistem
          <span className="mx-2">•</span>
          <a href="/guide" className="text-white/50 hover:text-white underline">📖 Buku Panduan</a>
        </p>
      </div>

      {/* Right Half — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/images/logo-keyocean.svg" alt="KayOcean" className="h-12 w-auto mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white">Masuk ke KayOcean</h2>
            <p className="text-sm mt-1 text-white/50">Masukkan email dan password Anda</p>
            {/* Decorative separator */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #0070F2)" }} />
              <div className="h-2 w-2 rounded-full" style={{ background: "#0070F2" }} />
              <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #0070F2)" }} />
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl p-8 border" style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-lg border text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}
                />
              </div>

              {error && (
                <div className="text-sm px-4 py-3 rounded-lg" style={{ background: "#FFF5F5", color: "#BB0000", border: "1px solid #FFCDD2" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "#0070F2" }}
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>
          </div>

          {/* Demo accounts */}
          <div className="mt-6 rounded-xl p-4 border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-[10px] font-bold uppercase text-center mb-2 text-white/40">Demo Accounts (password: admin123)</p>
            <div className="grid grid-cols-1 gap-1 text-[11px] text-white/60">
              <div className="flex justify-between px-2 py-1 rounded">
                <span>admin@keyocean.co.id</span><span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>Owner</span>
              </div>
              <div className="flex justify-between px-2 py-1 rounded">
                <span>budi@keyocean.co.id</span><span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>Manager</span>
              </div>
              <div className="flex justify-between px-2 py-1 rounded">
                <span>siti@keyocean.co.id</span><span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>Sales</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
