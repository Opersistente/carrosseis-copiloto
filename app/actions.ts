"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getPost,
  getPreset,
  newId,
  savePost,
  savePreset,
  deletePreset as deletePresetFromStore,
  uploadAsset,
} from "@/lib/store";
import type { ContentType, InputMaterial, Post, Preset } from "@/lib/types";
import { publishToInstagram, publishToLinkedin } from "@/lib/publish";

export async function createPost(formData: FormData) {
  const type = String(formData.get("type") || "text") as InputMaterial["type"];
  const title = String(formData.get("title") || "").trim() || "Post sem título";
  const presetId = String(formData.get("presetId") || "");
  const notes = String(formData.get("notes") || "").trim();
  const contentType = (String(formData.get("contentType") || "caso") as ContentType);

  const input: InputMaterial = { type };
  if (type === "link") {
    input.url = String(formData.get("url") || "").trim();
  } else if (type === "text") {
    input.text = String(formData.get("text") || "").trim();
  } else {
    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      const id = newId("material");
      const buf = Buffer.from(await file.arrayBuffer());
      const url = await uploadAsset(`materials/${id}-${file.name}`, buf, file.type);
      input.fileUrl = url;
      input.fileName = file.name;
    }
  }

  const now = new Date().toISOString();
  const post: Post = {
    id: newId("post"),
    title,
    status: "pending",
    contentType,
    input,
    presetId,
    notes: notes || undefined,
    createdAt: now,
    updatedAt: now,
  };
  await savePost(post);
  revalidatePath("/");
  redirect(`/post/${post.id}`);
}

export async function updatePostCaptions(
  id: string,
  captionInstagram: string,
  captionLinkedin: string
) {
  const post = await getPost(id);
  if (!post || !post.generated) throw new Error("Post ainda não foi gerado.");
  post.generated.captionInstagram = captionInstagram;
  post.generated.captionLinkedin = captionLinkedin;
  await savePost(post);
  revalidatePath(`/post/${id}`);
}

export async function approvePost(id: string) {
  const post = await getPost(id);
  if (!post || !post.generated) throw new Error("Post ainda não foi gerado.");
  post.status = "approved";
  await savePost(post);
  revalidatePath(`/post/${id}`);
  revalidatePath("/");
}

export async function backToGenerated(id: string) {
  const post = await getPost(id);
  if (!post) throw new Error("Post não encontrado.");
  post.status = "generated";
  await savePost(post);
  revalidatePath(`/post/${id}`);
  revalidatePath("/");
}

export async function publishPost(id: string, platform: "instagram" | "linkedin") {
  const post = await getPost(id);
  if (!post || !post.generated) throw new Error("Post ainda não foi gerado.");
  if (post.status !== "approved" && post.status !== "published") {
    throw new Error("Aprove o post antes de publicar.");
  }

  const record =
    platform === "instagram"
      ? await publishToInstagram(post)
      : await publishToLinkedin(post);

  post.publish = post.publish || {};
  post.publish[platform] = record;
  post.status = "published";
  await savePost(post);
  revalidatePath(`/post/${id}`);
  revalidatePath("/");
}

export async function savePresetAction(formData: FormData) {
  const id = String(formData.get("id") || "") || newId("preset");
  const existing = await getPreset(id);
  const now = new Date().toISOString();

  const preset: Preset = {
    id,
    name: String(formData.get("name") || "Sem nome"),
    description: String(formData.get("description") || ""),
    colors: {
      background: String(formData.get("background") || "#0A1220"),
      primary: String(formData.get("primary") || "#4DA3FF"),
      accent2: String(formData.get("accent2") || "#6EE7F0"),
      cta: String(formData.get("cta") || "#25D366"),
      text: String(formData.get("text") || "#FFFFFF"),
    },
    typography: {
      headingFont: String(formData.get("headingFont") || "Inter"),
      bodyFont: String(formData.get("bodyFont") || "Inter"),
      headingSize: Number(formData.get("headingSize") || 64),
      bodySize: Number(formData.get("bodySize") || 30),
    },
    guidance: {
      carrossel: String(formData.get("guidanceCarrossel") || ""),
      linkedin: String(formData.get("guidanceLinkedin") || ""),
    },
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  await savePreset(preset);
  revalidatePath("/config");
}

export async function deletePresetAction(id: string) {
  await deletePresetFromStore(id);
  revalidatePath("/config");
}
