// Cria o estilo padrão "Corporate Blue" (o visual já validado até aqui) se ainda não existir.
import { listPresets, savePreset } from "./blob-lib.mjs";

const existing = await listPresets();
if (existing.some((p) => p.id === "corporate-blue")) {
  console.log("Preset corporate-blue já existe.");
  process.exit(0);
}

const now = new Date().toISOString();
await savePreset({
  id: "corporate-blue",
  name: "Corporate Blue",
  description: "Estilo padrão validado — fundo navy, azul + ciano, CTA verde WhatsApp.",
  colors: {
    background: "#0A1220",
    primary: "#4DA3FF",
    accent2: "#6EE7F0",
    cta: "#25D366",
    text: "#FFFFFF",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    headingSize: 64,
    bodySize: 30,
  },
  guidance: {
    carrossel:
      "8 slides, uma ideia por slide, roteiro fixo: Gancho (dado mais chocante, sozinho) -> Fonte (de onde veio, mockup do documento) -> Processo (timeline numerada da Lia) -> Achado principal (visual: gauge/número grande) -> Achado secundário (tabela/comparação) -> Conclusão (caminhos + resultado, como conclusão da Lia) -> Marca (\"Isso é o Projeto Copiloto: eu + a Lia organizando o que você já tem, pra você decidir melhor. Você continua no comando.\") -> CTA (WhatsApp). Tom consultivo, direto, sem enrolação. Anonimizar qualquer coisa que identifique um cliente real.",
    linkedin:
      "Imagem única quadrada só com o gancho. Legenda: abertura narrativa (\"um empresário me procurou...\"), 3-4 achados em bullets (→), fecho reflexivo convidando comentário. Tom consultivo, sem CTA agressivo de WhatsApp.",
  },
  createdAt: now,
  updatedAt: now,
});

console.log("Preset corporate-blue criado.");
