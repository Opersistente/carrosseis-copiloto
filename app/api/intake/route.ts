import { NextRequest, NextResponse } from "next/server";
import { newId, savePost } from "@/lib/store";
import type { ContentType, InputMaterial, Post } from "@/lib/types";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-intake-secret");
  if (!process.env.INTAKE_SECRET || secret !== process.env.INTAKE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const { title, type, text, url, fileUrl, fileName, presetId, contentType, notes, source } = body as {
    title?: string;
    type?: InputMaterial["type"];
    text?: string;
    url?: string;
    fileUrl?: string;
    fileName?: string;
    presetId?: string;
    contentType?: ContentType;
    notes?: string;
    source?: string;
  };

  if (!type || !["text", "link", "file", "pdf"].includes(type)) {
    return NextResponse.json({ error: "type must be text, link, file or pdf" }, { status: 400 });
  }
  if (contentType && !["caso", "informativo"].includes(contentType)) {
    return NextResponse.json({ error: "contentType must be caso or informativo" }, { status: 400 });
  }
  if (type === "text" && !text) {
    return NextResponse.json({ error: "text is required for type=text" }, { status: 400 });
  }
  if (type === "link" && !url) {
    return NextResponse.json({ error: "url is required for type=link" }, { status: 400 });
  }
  if ((type === "file" || type === "pdf") && !fileUrl) {
    return NextResponse.json({ error: "fileUrl is required for type=file/pdf" }, { status: 400 });
  }

  const input: InputMaterial = { type, text, url, fileUrl, fileName };
  const now = new Date().toISOString();
  const post: Post = {
    id: newId("post"),
    title: title?.trim() || "Post sem título",
    status: "pending",
    contentType: contentType || "caso",
    input,
    presetId: presetId || "corporate-blue",
    notes: [source ? `Origem: ${source}` : null, notes].filter(Boolean).join(" — ") || undefined,
    createdAt: now,
    updatedAt: now,
  };
  await savePost(post);

  return NextResponse.json({
    id: post.id,
    status: post.status,
    reviewUrl: `https://carrosseis-copiloto.vercel.app/post/${post.id}`,
  });
}
