import { list, put, del } from "@vercel/blob";
import type { Post, Preset } from "./types";

const POSTS_PREFIX = "data/posts/";
const PRESETS_PREFIX = "data/presets/";

async function readJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao ler ${url}: ${res.status}`);
  return res.json();
}

async function writeJson(pathname: string, data: unknown) {
  const { url } = await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return url;
}

export function newId(prefix: string) {
  const stamp = new Date().toISOString().slice(0, 10);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${stamp}-${rand}`;
}

// ---- Posts ----

export async function listPosts(): Promise<Post[]> {
  const { blobs } = await list({ prefix: POSTS_PREFIX });
  const posts = await Promise.all(blobs.map((b) => readJson<Post>(b.url)));
  return posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPost(id: string): Promise<Post | null> {
  const { blobs } = await list({ prefix: `${POSTS_PREFIX}${id}.json` });
  if (blobs.length === 0) return null;
  return readJson<Post>(blobs[0].url);
}

export async function savePost(post: Post): Promise<Post> {
  post.updatedAt = new Date().toISOString();
  await writeJson(`${POSTS_PREFIX}${post.id}.json`, post);
  return post;
}

export async function deletePost(id: string): Promise<void> {
  const { blobs } = await list({ prefix: `${POSTS_PREFIX}${id}.json` });
  await Promise.all(blobs.map((b) => del(b.url)));
}

// ---- Presets ----

export async function listPresets(): Promise<Preset[]> {
  const { blobs } = await list({ prefix: PRESETS_PREFIX });
  const presets = await Promise.all(blobs.map((b) => readJson<Preset>(b.url)));
  return presets.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPreset(id: string): Promise<Preset | null> {
  const { blobs } = await list({ prefix: `${PRESETS_PREFIX}${id}.json` });
  if (blobs.length === 0) return null;
  return readJson<Preset>(blobs[0].url);
}

export async function savePreset(preset: Preset): Promise<Preset> {
  preset.updatedAt = new Date().toISOString();
  await writeJson(`${PRESETS_PREFIX}${preset.id}.json`, preset);
  return preset;
}

export async function deletePreset(id: string): Promise<void> {
  const { blobs } = await list({ prefix: `${PRESETS_PREFIX}${id}.json` });
  await Promise.all(blobs.map((b) => del(b.url)));
}

// ---- Uploaded source files / generated images ----

export async function uploadAsset(
  pathname: string,
  data: Buffer | Blob | string,
  contentType?: string
): Promise<string> {
  const { url } = await put(pathname, data, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return url;
}
