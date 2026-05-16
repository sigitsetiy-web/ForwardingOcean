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

      // Set user in store
      setUser(data.user);
      
      // Save to localStorage for persistence
      localStorage.setItem("fms_user", JSON.stringify(data.user));
      
      router.push("/dashboard");
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #003B62 0%, #0070F2 50%, #003B62 100%)" }}>
      <div className="w-full max-w-md mx-4">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-white/10 backdrop-blur mb-4">
            <img src="/images/logo-keyocean.svg" alt="KeyOcean" className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">KeyOcean</h1>
          <p className="text-sm text-white/60 mt-1">Forwarding Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold" style={{ color: "#003B62" }}>Selamat Datang</h2>
            <p className="text-sm mt-1" style={{ color: "#6A6D70" }}>Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#32363A" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                required
                className="w-full px-4 py-3 rounded-lg border text-sm focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none transition-all"
                style={{ borderColor: "#D1D2D4" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#32363A" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border text-sm focus:ring-2 focus:ring-[#0070F2] focus:border-[#0070F2] outline-none transition-all"
                style={{ borderColor: "#D1D2D4" }}
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

          {/* Demo accounts info */}
          <div className="mt-6 pt-4 border-t" style={{ borderColor: "#D1D2D4" }}>
            <p className="text-[10px] font-medium text-center mb-2" style={{ color: "#6A6D70" }}>Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-1 text-[10px]" style={{ color: "#6A6D70" }}>
              <span>admin@keyocean.co.id</span><span>admin123</span>
              <span>budi@keyocean.co.id</span><span>admin123</span>
              <span>siti@keyocean.co.id</span><span>admin123</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-6">© 2026 Wasilah Digital Sistem</p>
      </div>
    </div>
  );
}
