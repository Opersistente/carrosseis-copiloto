import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { matchRule } from "@/lib/autoreply";

// Webhook do Instagram (Graph API com login do Facebook, app "Projeto Copiloto Posts").
// Env: IG_VERIFY_TOKEN, IG_APP_SECRET (chave secreta do app Meta), IG_ACCESS_TOKEN (token da Página),
// IG_USER_ID (id da conta do Instagram, pra ignorar os próprios comentários).

const GRAPH = "https://graph.facebook.com/v23.0";

// Verificação do webhook: a Meta chama com hub.challenge ao cadastrar a URL.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  if (p.get("hub.mode") === "subscribe" && p.get("hub.verify_token") === process.env.IG_VERIFY_TOKEN) {
    return new NextResponse(p.get("hub.challenge") ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}

function validSignature(raw: string, header: string | null): boolean {
  const secret = process.env.IG_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(raw).digest("hex"));
  const got = Buffer.from(header.slice(7));
  return expected.length === got.length && timingSafeEqual(expected, got);
}

async function graphPost(path: string, body: unknown) {
  const res = await fetch(`${GRAPH}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.IG_ACCESS_TOKEN}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error(`[ig-webhook] POST ${path} -> ${res.status}`, await res.text());
  return res.ok;
}

type CommentChange = {
  field: string;
  value: { id: string; text?: string; from?: { id: string; username?: string }; media?: { id: string } };
};

async function handleComment(change: CommentChange) {
  const { id: commentId, text, from } = change.value;
  if (!text || !from) return;
  if (from.id === process.env.IG_USER_ID) return; // ignora os próprios comentários (evita loop)

  const rule = matchRule(text);
  if (!rule) return;

  // Private reply: só 1 por comentário, até 7 dias depois. Se já foi enviada, a API recusa.
  // Com token de Página, "me" é a própria Página vinculada ao Instagram.
  const sent = await graphPost("me/messages", {
    recipient: { comment_id: commentId },
    message: { text: rule.dm },
  });
  if (!sent) return;

  const reply = rule.publicReplies[Math.floor(Math.random() * rule.publicReplies.length)];
  await graphPost(`${commentId}/replies`, { message: reply });
  console.log(`[ig-webhook] respondeu @${from.username ?? from.id} (${rule.keyword})`);
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!validSignature(raw, req.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(raw) as { object?: string; entry?: { changes?: CommentChange[] }[] };
  if (body.object === "instagram") {
    const changes = (body.entry ?? []).flatMap((e) => e.changes ?? []).filter((c) => c.field === "comments");
    await Promise.all(changes.map(handleComment));
  }

  // Sempre 200 rápido: se a Meta não recebe 200, ela reenvia e depois desativa o webhook.
  return NextResponse.json({ ok: true });
}
