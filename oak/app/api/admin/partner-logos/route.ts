import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

function extensionForFile(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName && ["png", "jpg", "jpeg", "webp", "svg"].includes(fromName)) {
    return fromName;
  }

  const byMimeType: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };

  return byMimeType[file.type] || "png";
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must sign in to upload logos." },
        { status: 401 }
      );
    }

    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adminProfile) {
      return NextResponse.json(
        { error: "You are not authorized to upload logos." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Choose an image file to upload." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Use PNG, JPG, WEBP, or SVG for the logo." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Logo files must be 2 MB or smaller." },
        { status: 400 }
      );
    }

    const extension = extensionForFile(file);
    const filePath = `logos/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("partner-logos")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Logo upload failed:", uploadError);

      return NextResponse.json(
        { error: "Could not upload the logo." },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("partner-logos").getPublicUrl(filePath);

    return NextResponse.json(
      {
        logoPath: publicUrl,
        storagePath: filePath,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Logo upload API failed:", error);

    return NextResponse.json(
      { error: "Unexpected error while uploading the logo." },
      { status: 500 }
    );
  }
}