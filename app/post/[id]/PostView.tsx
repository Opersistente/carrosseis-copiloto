"use client";

import { useState, useTransition } from "react";
import type { Post, Preset } from "@/lib/types";
import {
  updatePostCaptions,
  approvePost,
  backToGenerated,
  publishPost,
} from "@/app/actions";

export default function PostView({ post, preset }: { post: Post; preset: Preset | null }) {
  const [captionInstagram, setCaptionInstagram] = useState(post.generated?.captionInstagram ?? "");
  const [captionLinkedin, setCaptionLinkedin] = useState(post.generated?.captionLinkedin ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-softer text-xs mb-1">Material de origem</div>
          <div className="font-semibold capitalize">{post.input.type}</div>
          {post.input.url && <a href={post.input.url} target="_blank" className="text-primary break-all">{post.input.url}</a>}
          {post.input.fileUrl && <a href={post.input.fileUrl} target="_blank" className="text-primary break-all">{post.input.fileName}</a>}
          {post.input.text && <p className="text-soft mt-1 line-clamp-4 whitespace-pre-wrap">{post.input.text}</p>}
        </div>
        <div>
          <div className="text-softer text-xs mb-1">Estilo</div>
          <div className="font-semibold">{preset?.name ?? "—"}</div>
          {post.notes && <p className="text-soft mt-1">{post.notes}</p>}
        </div>
      </div>

      {post.status === "pending" && (
        <div className="card p-8 text-center">
          <p className="text-soft">
            Na fila, aguardando geração. Isso acontece numa sessão do Claude Code que lê o material,
            escreve os 8 slides seguindo o estilo escolhido, renderiza as imagens e sobe aqui.
          </p>
        </div>
      )}

      {post.generated && (
        <>
          <div>
            <div className="text-softer text-xs mb-2 uppercase font-bold">Carrossel Instagram</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {post.generated.slides.map((src, i) => (
                <img key={i} src={src} alt={`Slide ${i + 1}`} className="rounded-lg border border-border" />
              ))}
            </div>
          </div>

          <div>
            <div className="text-softer text-xs mb-2 uppercase font-bold">Imagem LinkedIn</div>
            <img
              src={post.generated.linkedinImageUrl}
              alt="LinkedIn"
              className="rounded-lg border border-border max-w-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="capIg">Legenda Instagram</label>
              <textarea
                id="capIg"
                rows={8}
                value={captionInstagram}
                onChange={(e) => setCaptionInstagram(e.target.value)}
                disabled={post.status === "published"}
              />
            </div>
            <div>
              <label htmlFor="capLi">Legenda LinkedIn</label>
              <textarea
                id="capLi"
                rows={8}
                value={captionLinkedin}
                onChange={(e) => setCaptionLinkedin(e.target.value)}
                disabled={post.status === "published"}
              />
            </div>
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex flex-wrap gap-3">
            {post.status !== "published" && (
              <button
                className="btn btn-ghost"
                disabled={isPending}
                onClick={() => run(() => updatePostCaptions(post.id, captionInstagram, captionLinkedin))}
              >
                Salvar edições
              </button>
            )}

            {post.status === "generated" && (
              <button
                className="btn btn-primary"
                disabled={isPending}
                onClick={() => run(() => approvePost(post.id))}
              >
                Aprovar
              </button>
            )}

            {post.status === "approved" && (
              <button
                className="btn btn-ghost"
                disabled={isPending}
                onClick={() => run(() => backToGenerated(post.id))}
              >
                Voltar pra revisão
              </button>
            )}

            {(post.status === "approved" || post.status === "published") && (
              <>
                <button
                  className="btn btn-primary"
                  disabled={isPending || !!post.publish?.instagram}
                  onClick={() => run(() => publishPost(post.id, "instagram"))}
                >
                  {post.publish?.instagram ? "Publicado no Instagram ✓" : "Publicar no Instagram"}
                </button>
                <button
                  className="btn btn-primary"
                  disabled={isPending || !!post.publish?.linkedin}
                  onClick={() => run(() => publishPost(post.id, "linkedin"))}
                >
                  {post.publish?.linkedin ? "Publicado no LinkedIn ✓" : "Publicar no LinkedIn"}
                </button>
              </>
            )}
          </div>

          {post.publish?.instagram && (
            <a href={post.publish.instagram.url} target="_blank" className="block text-primary text-sm">
              Ver no Instagram →
            </a>
          )}
          {post.publish?.linkedin && (
            <a href={post.publish.linkedin.url} target="_blank" className="block text-primary text-sm">
              Ver no LinkedIn →
            </a>
          )}
        </>
      )}
    </div>
  );
}
