import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const BUCKET_NAME = "documents";

/**
 * Upload a file to Supabase Storage
 * Files are organized by job order: documents/{jobOrderId}/{type}/{filename}
 */
export async function uploadFile(
  file: File,
  jobOrderId: string,
  documentType: string
): Promise<{ url: string; path: string }> {
  const supabase = createBrowserSupabaseClient();

  // Generate unique filename
  const timestamp = Date.now();
  const ext = file.name.split(".").pop() || "pdf";
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .toLowerCase();
  const filePath = `${jobOrderId}/${documentType}/${timestamp}_${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return { url: publicUrl, path: data.path };
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    throw new Error(`Hapus file gagal: ${error.message}`);
  }
}

/**
 * Get a signed URL for private file access (valid for 1 hour)
 */
export async function getSignedUrl(filePath: string): Promise<string> {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 3600);

  if (error) {
    throw new Error(`Gagal membuat signed URL: ${error.message}`);
  }

  return data.signedUrl;
}
