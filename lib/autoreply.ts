// Regras do robô de comentários do Instagram (estilo ManyChat).
// Quem comenta a palavra-chave recebe uma DM (private reply) e uma resposta pública no comentário.

export type AutoReplyRule = {
  keyword: string; // comparado sem acento e sem diferenciar maiúscula/minúscula
  dm: string; // mensagem enviada no direct
  publicReplies: string[]; // uma é sorteada, pra não repetir sempre o mesmo texto
};

const WHATSAPP =
  "https://wa.me/5547989160226?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20o%20Projeto%20Copiloto.";

export const RULES: AutoReplyRule[] = [
  {
    keyword: "COPILOTO",
    dm:
      "Opa! Vi teu comentário 🙌\n\n" +
      "O Copiloto do Empresário organiza os números do teu negócio (caixa, margem por produto, onde tá vazando dinheiro) " +
      "e aponta o próximo passo. Quem decide continua sendo tu.\n\n" +
      "Quer ver como isso funciona no teu caso? Me chama no WhatsApp:\n" +
      WHATSAPP,
    publicReplies: [
      "Te mandei no direct! 📩",
      "Enviei no teu direct, dá uma olhada 📩",
      "Chegou no teu direct! 👊",
    ],
  },
];

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
}

export function matchRule(commentText: string): AutoReplyRule | null {
  const words = normalize(commentText).split(/[^A-Z0-9]+/);
  return RULES.find((r) => words.includes(normalize(r.keyword))) ?? null;
}
