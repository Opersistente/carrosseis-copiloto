"use client";

import { useState } from "react";
import type { Preset } from "@/lib/types";

type MaterialType = "text" | "link" | "file" | "pdf";

const TYPE_LABEL: Record<MaterialType, string> = {
  text: "Texto colado",
  link: "Link",
  file: "Arquivo",
  pdf: "PDF",
};

export default function NovoForm({
  presets,
  createPost,
}: {
  presets: Preset[];
  createPost: (formData: FormData) => void;
}) {
  const [type, setType] = useState<MaterialType>("text");

  return (
    <form action={createPost} className="card p-6 space-y-5 max-w-2xl">
      <div>
        <label htmlFor="title">Título curto (só pra identificar na fila)</label>
        <input id="title" name="title" placeholder="Ex: vazamento de dados na fatura" required />
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
