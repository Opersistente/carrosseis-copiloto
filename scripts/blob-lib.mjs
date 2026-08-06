import { list, put } from "@vercel/blob";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const POSTS_PREFIX = "data/posts/";
const PRESETS_PREFIX = "data/presets/";

const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json",
  ".txt": "text/plain",
};

async function readJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao ler ${url}: ${res.status}`);
  return res.json();
}

async function writeJson(pathname, data) {
  const { url } = await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return url;
}

export async function listPosts() {
  const { blobs } = await list({ prefix: POSTS_PREFIX });
  return Promise.all(blobs.map((b) => readJson(b.url)));
}

export async function getPost(id) {
  const { blobs } = await list({ prefix: `${POSTS_PREFIX}${id}.json` });
  if (blobs.length === 0) return null;
  return readJson(blobs[0].url);
}

export async function savePost(post) {
  post.updatedAt = new Date().toISOString();
  await writeJson(`${POSTS_PREFIX}${post.id}.json`, post);
  return post;
}

export async function listPresets() {
  const { blobs } = await list({ prefix: PRESETS_PREFIX });
  return Promise.all(blobs.map((b) => readJson(b.url)));
}

export async function getPreset(id) {
  const { blobs } = await list({ prefix: `${PRESETS_PREFIX}${id}.json` });
  if (blobs.length === 0) return null;
  return readJson(blobs[0].url);
}

export async function savePreset(preset) {
  preset.updatedAt = new Date().toISOString();
  await writeJson(`${PRESETS_PREFIX}${preset.id}.json`, preset);
  return preset;
}

export async function uploadFile(localPath, pathname) {
  const data = readFileSync(localPath);
  const contentType = CONTENT_TYPES[extname(localPath).toLowerCase()];
  const { url } = await put(pathname, data, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return url;
}
