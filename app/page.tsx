import Link from "next/link";
import { listPosts } from "@/lib/store";
import type { PostStatus } from "@/lib/types";

const STATUS_LABEL: Record<PostStatus, string> = {
  pending: "Aguardando geração",
  generated: "Gerado — revisar",
  approved: "Aprovado — publicar",
  published: "Publicado",
};

export const dynamic = "force-dynamic";

export default async function FilaPage() {
  const posts = await listPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">Fila</h1>
        <Link href="/novo" className="btn btn-primary">+ Novo post</Link>
      </div>

      {posts.length === 0 && (
        <div className="card p-8 text-center text-soft">
          Nenhum post ainda. Clique em <strong>Novo post</strong> pra começar.
        </div>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="card p-4 flex items-center justify-between hover:border-primary transition-colors"
          >
            <div>
              <div className="font-bold">{post.title}</div>
              <div className="text-xs text-softer mt-1">
                {post.input.type} · criado em {new Date(post.createdAt).toLocaleString("pt-BR")}
              </div>
            </div>
            <span className={`badge badge-${post.status}`}>{STATUS_LABEL[post.status]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
