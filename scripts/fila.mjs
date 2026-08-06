// Lista a fila de posts do dashboard. Uso: node scripts/fila.mjs [status]
import { listPosts } from "./blob-lib.mjs";

const filter = process.argv[2];
const posts = await listPosts();
const filtered = filter ? posts.filter((p) => p.status === filter) : posts;

if (filtered.length === 0) {
  console.log(filter ? `Nenhum post com status "${filter}".` : "Fila vazia.");
} else {
  for (const p of filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    console.log(`[${p.status}] ${p.id} — ${p.title} (preset: ${p.presetId || "—"}, formato: ${p.contentType || "caso"})`);
  }
}
