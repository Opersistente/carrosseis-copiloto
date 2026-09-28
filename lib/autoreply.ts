// Regras do robô de comentários do Instagram (estilo ManyChat).
// Quem comenta a palavra-chave recebe uma DM (private reply) e uma resposta pública no comentário.

export type AutoReplyRule = {
  keyword: string; // comparado sem acento e sem diferenciar maiúscula/minúscula
  dm: string; // mensagem enviada no direct
  publicReplies: string[]; // uma é sorteada, pra não repetir sempre o mesmo texto
};

export const RULES: AutoReplyRule[] = [
  {
    keyword: "COPILOTO",
    dm:
      "Opa! Vi teu comentário 🙌\n\n" +
      "O Copiloto do Empresário organiza os números do teu negócio (caixa, margem por produto, onde tá vazando dinheiro) " +
      "e aponta o próximo passo. Quem decide continua sendo tu.\n\n" +
      "Me conta aqui mesmo: qual é o teu negócio e o que mais te tira o sono hoje? " +
      "Caixa apertado, margem baixa ou falta de tempo? Te respondo por aqui.",
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
