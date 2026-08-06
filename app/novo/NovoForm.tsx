"use client";

import { useState } from "react";
import type { ContentType, Preset } from "@/lib/types";

type MaterialType = "text" | "link" | "file" | "pdf";

const TYPE_LABEL: Record<MaterialType, string> = {
  text: "Texto colado",
  link: "Link",
  file: "Arquivo",
  pdf: "PDF",
};

const CONTENT_TYPE_LABEL: Record<ContentType, { label: string; description: string }> = {
  caso: {
    label: "Situação (caso)",
    description: "A Lia encontrou uma situação/dor real, investigou, solucionou e aplicou. Roteiro conta essa história: fonte → processo → achados → conclusão.",
  },
  informativo: {
    label: "Informativo",
    description: "Não é um caso — é informação útil (pesquisa, dado de mercado, dica). Roteiro explica o contexto e os pontos principais, sem narrativa de caso.",
  },
};

export default function NovoForm({
  presets,
  createPost,
}: {
  presets: Preset[];
  createPost: (formData: FormData) => void;
}) {
  const [type, setType] = useState<MaterialType>("text");
  const [contentType, setContentType] = useState<ContentType>("caso");

  return (
    <form action={createPost} className="card p-6 space-y-5 max-w-2xl">
      <div>
        <label htmlFor="title">Título curto (só pra identificar na fila)</label>
        <input id="title" name="title" placeholder="Ex: vazamento de dados na fatura" required />
      </div>

      <div>
        <label>Formato do post</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CONTENT_TYPE_LABEL) as ContentType[]).map((ct) => (
            <button
              type="button"
              key={ct}
              onClick={() => setContentType(ct)}
              className={`btn ${contentType === ct ? "btn-primary" : "btn-ghost"}`}
            >
              {CONTENT_TYPE_LABEL[ct].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-softer mt-1">{CONTENT_TYPE_LABEL[contentType].description}</p>
        <input type="hidden" name="contentType" value={contentType} />
      </div>

      <div>
        <label>Tipo de material</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABEL) as MaterialType[]).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`btn ${type === t ? "btn-primary" : "btn-ghost"}`}
            >
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
        <input type="hidden" name="type" value={type} />
      </div>

      {type === "text" && (
        <div>
          <label htmlFor="text">Cole o texto/material aqui</label>
          <textarea id="text" name="text" rows={8} placeholder="Cole a conversa, análise, dados..." />
        </div>
      )}

      {type === "link" && (
        <div>
          <label htmlFor="url">Link do material</label>
          <input id="url" name="url" type="url" placeholder="https://..." />
        </div>
      )}

      {(type === "file" || type === "pdf") && (
        <div>
          <label htmlFor="file">{type === "pdf" ? "Arquivo PDF" : "Arquivo"}</label>
          <input id="file" name="file" type="file" accept={type === "pdf" ? "application/pdf" : undefined} />
        </div>
      )}

      <div>
        <label htmlFor="presetId">Estilo</label>
        <select id="presetId" name="presetId" defaultValue={presets[0]?.id ?? ""}>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {presets.length === 0 && (
          <p className="text-xs text-softer mt-1">
            Nenhum estilo configurado ainda — vá em Configurações pra criar um.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notes">Observações pra geração (opcional)</label>
        <textarea id="notes" name="notes" rows={3} placeholder="Algo específico que esse post precisa considerar..." />
      </div>

      <button type="submit" className="btn btn-primary">Enviar pra fila</button>
    </form>
  );
}
