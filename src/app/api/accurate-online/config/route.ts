import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  hasAccurateCredentials,
  saveAccurateCredentials,
} from "@/lib/env-file";
import { resetAccurateService } from "@/lib/accurate-online";

export const dynamic = "force-dynamic";

async function testAccurateConnection(signatureSecret: string, apiToken: string) {
  const timestamp = getTimestamp();
  const signature = crypto
    .createHmac("sha256", signatureSecret)
    .update(timestamp)
    .digest("base64");

  const response = await fetch("https://account.accurate.id/api/api-token.do", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "X-Api-Timestamp": timestamp,
      "X-Api-Signature": signature,
    },
  });

  return response.json();
}

// GET /api/accurate-online/config - Get current connection info
export async function GET() {
  const signatureSecret = process.env.ACCURATE_SIGNATURE_SECRET || "";
  const apiToken = process.env.ACCURATE_API_TOKEN || "";
  const configured = hasAccurateCredentials();

  if (!configured) {
    return NextResponse.json({
      connected: false,
      configured: false,
      signatureSecret: "",
      apiToken: "",
      host: null,
      database: null,
      user: null,
    });
  }

  try {
    const data = await testAccurateConnection(signatureSecret, apiToken);

    if (data.s && typeof data.d === "object" && "database" in data.d) {
      return NextResponse.json({
        connected: true,
        configured: true,
        signatureSecret: "***" + signatureSecret.slice(-8),
        apiToken: apiToken.substring(0, 20) + "...",
        host: data.d.database.host,
        database: {
          alias: data.d.database.alias,
          id: data.d.database.id,
        },
        user: data.d.user
          ? { name: data.d.user.fullName, email: data.d.user.email }
          : null,
      });
    }

    return NextResponse.json({
      connected: false,
      configured: true,
      signatureSecret: "***" + signatureSecret.slice(-8),
      apiToken: apiToken.substring(0, 20) + "...",
      error: Array.isArray(data.d) ? data.d.join(", ") : "Connection failed",
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      configured: true,
      signatureSecret: "***" + signatureSecret.slice(-8),
      apiToken: apiToken.substring(0, 20) + "...",
      error: error instanceof Error ? error.message : "Connection failed",
    });
  }
}

// POST /api/accurate-online/config - Test or save credentials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signatureSecret, apiToken, action } = body;

    if (!signatureSecret || !apiToken) {
      return NextResponse.json(
        { success: false, error: "Signature Secret dan API Token wajib diisi" },
        { status: 400 }
      );
    }

    const data = await testAccurateConnection(signatureSecret, apiToken);

    if (!(data.s && typeof data.d === "object" && "database" in data.d)) {
      return NextResponse.json({
        success: false,
        error: Array.isArray(data.d)
          ? data.d.join(", ")
          : "Gagal terhubung ke Accurate Online",
      });
    }

    if (action === "save") {
      try {
        saveAccurateCredentials(signatureSecret, apiToken);
        resetAccurateService();
      } catch (err) {
        return NextResponse.json(
          {
            success: false,
            error:
              err instanceof Error
                ? `Gagal menyimpan: ${err.message}`
                : "Gagal menyimpan konfigurasi",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      database: data.d.database,
      user: data.d.user,
      message:
        action === "save"
          ? "Credentials berhasil disimpan dan koneksi aktif."
          : "Koneksi berhasil!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Connection test failed",
      },
      { status: 500 }
    );
  }
}

function getTimestamp(): string {
  const now = new Date();
  const jakartaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(jakartaTime.getDate())}/${p(jakartaTime.getMonth() + 1)}/${jakartaTime.getFullYear()} ${p(jakartaTime.getHours())}:${p(jakartaTime.getMinutes())}:${p(jakartaTime.getSeconds())}`;
}
