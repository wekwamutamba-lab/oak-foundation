import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function extensionForFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && ["jpg", "jpeg", "png", "webp"].includes(extension)) {
    return extension;
  }

  const mimeExtensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return mimeExtensions[file.type] || "jpg";
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
        { error: "You must sign in to upload documentation photos." },
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
        { error: "You are not authorized to upload documentation photos." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Choose a photograph to upload." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Use JPG, PNG, or WEBP images only." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Photos must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    const extension = extensionForFile(file);
    const filePath = `event-photos/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("documentation-photos")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Documentation photo upload failed:", uploadError);

      return NextResponse.json(
        { error: "Could not upload the photo." },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("documentation-photos")
      .getPublicUrl(filePath);

    return NextResponse.json(
      {
        imagePath: publicUrl,
        storagePath: filePath,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Documentation photo upload API failed:", error);

    return NextResponse.json(
      { error: "Unexpected error while uploading the photo." },
      { status: 500 }
    );
  }
}