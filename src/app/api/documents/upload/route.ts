import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

const BUCKET_NAME = "documents";


export const dynamic = 'force-dynamic';

// POST /api/documents/upload - Upload document file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const jobOrderId = formData.get("jobOrderId") as string;
    const documentType = formData.get("type") as string;
    const documentName = formData.get("name") as string;
    const deadline = formData.get("deadline") as string | null;
    const notes = formData.get("notes") as string | null;
    const uploadedById = formData.get("uploadedById") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "File wajib diupload" },
        { status: 400 }
      );
    }

    if (!jobOrderId || !documentType || !documentName) {
      return NextResponse.json(
        { error: "jobOrderId, type, dan name wajib diisi" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 10MB" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan PDF, JPG, PNG, atau Excel." },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const supabase = createServerSupabaseClient();
    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "pdf";
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    const filePath = `${jobOrderId}/${documentType}/${timestamp}_${sanitizedName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload gagal: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData.path);

    // Check if document record already exists (update) or create new
    const existingDoc = await prisma.document.findFirst({
      where: {
        jobOrderId,
        type: documentType as never,
        name: documentName,
      },
    });

    let document;
    if (existingDoc) {
      // Update existing - increment version
      document = await prisma.document.update({
        where: { id: existingDoc.id },
        data: {
          fileUrl: publicUrl,
          version: existingDoc.version + 1,
          status: "UPLOADED",
          uploadedById,
        },
      });
    } else {
      // Create new document record
      document = await prisma.document.create({
        data: {
          jobOrderId,
          type: documentType as never,
          name: documentName,
          fileUrl: publicUrl,
          status: "UPLOADED",
          deadline: deadline ? new Date(deadline) : undefined,
          notes,
          uploadedById,
        },
      });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        jobOrderId,
        action: "DOCUMENT_UPLOADED",
        description: `Dokumen "${documentName}" (${documentType}) diupload${existingDoc ? ` (v${document.version})` : ""}`,
        userId: uploadedById || "system",
      },
    });

    return NextResponse.json(
      {
        data: document,
        fileUrl: publicUrl,
        message: "Dokumen berhasil diupload",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Gagal mengupload dokumen" },
      { status: 500 }
    );
  }
}
