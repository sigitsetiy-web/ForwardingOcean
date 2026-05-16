import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/auth/login - Simple email/password login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { branch: { select: { id: true, name: true, code: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Akun tidak aktif" }, { status: 401 });
    }

    // Simple password check (for demo: accept "admin123" for all users)
    // In production, use bcrypt hash comparison
    if (password !== "admin123") {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // Return user data (no JWT for simplicity — use session/localStorage on client)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        branchId: user.branchId,
        supabaseUserId: user.id, // use same id
      },
      message: "Login berhasil",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login gagal. Coba lagi." }, { status: 500 });
  }
}
