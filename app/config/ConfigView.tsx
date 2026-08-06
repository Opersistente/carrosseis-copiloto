"use client";

import { useState, useTransition } from "react";
import type { Preset } from "@/lib/types";

const BLANK: Omit<Preset, "createdAt" | "updatedAt"> = {
  id: "",
  name: "",
  description: "",
  colors: { background: "#0A1220", primary: "#4DA3FF", accent2: "#6EE7F0", cta: "#25D366", text: "#FFFFFF" },
  typography: { headingFont: "Inter", bodyFont: "Inter", headingSize: 64, bodySize: 30 },
  guidance: {
    carrossel:
      "8 slides, uma ideia por slide: Gancho -> Fonte -> Processo -> Achado principal -> Achado secundário -> Conclusão -> Marca -> CTA. Tom consultivo, direto, sem enrolação.",
    linkedin:
      "Abertura narrativa, 3-4 achados em bullets, fecho reflexivo convidando comentário. Tom consultivo, sem CTA agressivo.",
  },
};

export default function ConfigView({
  presets,
  savePreset,
  deletePreset,
}: {
  presets: Preset[];
  savePreset: (formData: FormData) => void;
  deletePreset: (id: string) => void;
}) {
  const [editing, setEditing] = useState<Preset | (typeof BLANK) | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid grid-cols-[280px_1fr] gap-6">
      <div className="space-y-2">
        <button className="btn btn-primary w-full" onClick={() => setEditing(BLANK)}>
          + Novo estilo
        </button>
        {presets.map((p) => (
          <div
            key={p.id}
            className={`card p-3 cursor-pointer ${editing?.id === p.id ? "border-primary" : ""}`}
            onClick={() => setEditing(p)}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: p.colors.primary }} />
              <span className="font-bold text-sm">{p.name}</span>
            </div>
            <p className="text-xs text-softer mt-1 line-clamp-2">{p.description}</p>
          </div>
        ))}
      </div>

      <div>
        {!editing && <div className="card p-8 text-center text-soft">Escolha um estilo pra editar ou crie um novo.</div>}

        {editing && (
          <form
            key={editing.id || "new"}
            action={savePreset}
            className="card p-6 space-y-5"
          >
            <input type="hidden" name="id" defaultValue={editing.id} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name">Nome do estilo</label>
                <input id="name" name="name" defaultValue={editing.name} required />
              </div>
              <div>
                <label htmlFor="description">Descrição / quando usar</label>
                <input id="description" name="description" defaultValue={editing.description} />
              </div>
            </div>

            <div>
              <div className="text-softer text-xs mb-2 uppercase font-bold">Cores</div>
              <div className="grid grid-cols-5 gap-3">
                {(Object.keys(editing.colors) as (keyof Preset["colors"])[]).map((key) => (
                  <div key={key}>
                    <label htmlFor={key}>{key}</label>
                    <input
                      id={key}
                      name={key}
                      type="color"
                      defaultValue={editing.colors[key]}
                      className="h-10 p-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-softer text-xs mb-2 uppercase font-bold">Tipografia</div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label htmlFor="headingFont">Fonte título</label>
                  <input id="headingFont" name="headingFont" defaultValue={editing.typography.headingFont} />
                </div>
                <div>
                  <label htmlFor="bodyFont">Fonte texto</label>
                  <input id="bodyFont" name="bodyFont" defaultValue={editing.typography.bodyFont} />
                </div>
                <div>
                  <label htmlFor="headingSize">Tamanho título (px)</label>
                  <input id="headingSize" name="headingSize" type="number" defaultValue={editing.typography.headingSize} />
                </div>
                <div>
                  <label htmlFor="bodySize">Tamanho texto (px)</label>
                  <input id="bodySize" name="bodySize" type="number" defaultValue={editing.typography.bodySize} />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="guidanceCarrossel">Como gerar o carrossel (Instagram)</label>
              <textarea
                id="guidanceCarrossel"
                name="guidanceCarrossel"
                rows={5}
                defaultValue={editing.guidance.carrossel}
              />
            </div>

            <div>
              <label htmlFor="guidanceLinkedin">Como gerar o post (LinkedIn)</label>
              <textarea
                id="guidanceLinkedin"
                name="guidanceLinkedin"
                rows={5}
                defaultValue={editing.guidance.linkedin}
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary">Salvar estilo</button>
              {editing.id && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      await deletePreset(editing.id);
                      setEditing(null);
                    })
                  }
                >
                  Excluir
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
