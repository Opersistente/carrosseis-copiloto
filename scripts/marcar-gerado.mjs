// Sobe os PNGs + legendas de uma pasta local pro Blob e marca o post como "gerado".
// Uso: node scripts/marcar-gerado.mjs <postId> <pasta-local>
// Espera na pasta: slide-1.png ... slide-8.png, linkedin.png, legenda-instagram.txt, legenda-linkedin.txt
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getPost, savePost, uploadFile } from "./blob-lib.mjs";

const [, , postId, folder] = process.argv;
if (!postId || !folder) {
  console.error("Uso: node scripts/marcar-gerado.mjs <postId> <pasta-local>");
  process.exit(1);
}

const post = await getPost(postId);
if (!post) {
  console.error(`Post ${postId} não encontrado.`);
  process.exit(1);
}

const slides = [];
for (let i = 1; i <= 8; i++) {
  const local = join(folder, `slide-${i}.png`);
  if (!existsSync(local)) {
    console.error(`Faltando ${local}`);
    process.exit(1);
  }
  const url = await uploadFile(local, `posts/${postId}/slide-${i}.png`);
  slides.push(url);
  console.log(`slide-${i}.png -> ${url}`);
}

const linkedinLocal = join(folder, "linkedin.png");
if (!existsSync(linkedinLocal)) {
  console.error(`Faltando ${linkedinLocal}`);
  process.exit(1);
}
const linkedinImageUrl = await uploadFile(linkedinLocal, `posts/${postId}/linkedin.png`);
console.log(`linkedin.png -> ${linkedinImageUrl}`);

const captionInstagram = readFileSync(join(folder, "legenda-instagram.txt"), "utf-8").trim();
const captionLinkedin = readFileSync(join(folder, "legenda-linkedin.txt"), "utf-8").trim();

post.generated = {
  slides,
  linkedinImageUrl,
  captionInstagram,
  captionLinkedin,
  generatedAt: new Date().toISOString(),
};
post.status = "generated";
await savePost(post);

console.log(`\nPost ${postId} marcado como "generated". Revisar em https://carrosseis-copiloto.vercel.app/post/${postId}`);
