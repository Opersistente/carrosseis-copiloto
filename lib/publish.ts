import type { Post, PublishRecord } from "./types";

const META_API = "https://graph.facebook.com/v21.0";
const LINKEDIN_API = "https://api.linkedin.com";
const LINKEDIN_VERSION = "202607";

// LinkedIn Flavored Text: esses caracteres são reservados pra formatação/menção
// no campo `commentary` da API. Sem escapar, a API trunca o texto no primeiro
// caractere reservado que encontra (foi o que causou legendas cortadas em
// texto com parênteses, ex: "(Texas Christian University)").
const LINKEDIN_RESERVED_CHARS = /[\\|{}@[\]()<>*_~]/g;
function escapeLinkedInText(text: string): string {
  return text.replace(LINKEDIN_RESERVED_CHARS, (char) => `\\${char}`);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Falta configurar a variável de ambiente ${name} no Vercel (Project Settings → Environment Variables).`
    );
  }
  return value;
}

export async function publishToInstagram(post: Post): Promise<PublishRecord> {
  if (!post.generated) throw new Error("Post sem conteúdo gerado.");
  const token = requireEnv("META_ACCESS_TOKEN");
  const igUserId = process.env.META_IG_USER_ID || "17841401629183171";

  const containerIds: string[] = [];
  for (const imageUrl of post.generated.slides) {
    const res = await fetch(`${META_API}/${igUserId}/media`, {
      method: "POST",
      body: new URLSearchParams({
        image_url: imageUrl,
        is_carousel_item: "true",
        access_token: token,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.id) {
      throw new Error(`Falha ao criar container do slide: ${JSON.stringify(data)}`);
    }
    containerIds.push(data.id);
  }

  const carouselRes = await fetch(`${META_API}/${igUserId}/media`, {
    method: "POST",
    body: new URLSearchParams({
      media_type: "CAROUSEL",
      caption: post.generated.captionInstagram,
      children: containerIds.join(","),
      access_token: token,
    }),
  });
  const carouselData = await carouselRes.json();
  if (!carouselRes.ok || !carouselData.id) {
    throw new Error(`Falha ao criar carrossel: ${JSON.stringify(carouselData)}`);
  }

  const publishRes = await fetch(`${META_API}/${igUserId}/media_publish`, {
    method: "POST",
    body: new URLSearchParams({
      creation_id: carouselData.id,
      access_token: token,
    }),
  });
  const publishData = await publishRes.json();
  if (!publishRes.ok || !publishData.id) {
    throw new Error(`Falha ao publicar: ${JSON.stringify(publishData)}`);
  }

  const permalinkRes = await fetch(
    `${META_API}/${publishData.id}?fields=permalink&access_token=${token}`
  );
  const permalinkData = await permalinkRes.json();

  return {
    publishedAt: new Date().toISOString(),
    url: permalinkData.permalink || `https://www.instagram.com/p/${publishData.id}/`,
  };
}

export async function publishToLinkedin(post: Post): Promise<PublishRecord> {
  if (!post.generated) throw new Error("Post sem conteúdo gerado.");
  const token = requireEnv("LINKEDIN_ACCESS_TOKEN");
  const sub = requireEnv("LINKEDIN_SUB");
  const author = `urn:li:person:${sub}`;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Restli-Protocol-Version": "2.0.0",
    "LinkedIn-Version": LINKEDIN_VERSION,
  };

  const initRes = await fetch(`${LINKEDIN_API}/rest/images?action=initializeUpload`, {
    method: "POST",
    headers,
    body: JSON.stringify({ initializeUploadRequest: { owner: author } }),
  });
  const initData = await initRes.json();
  if (!initRes.ok || !initData.value) {
    throw new Error(`Falha ao iniciar upload da imagem: ${JSON.stringify(initData)}`);
  }
  const { uploadUrl, image: imageUrn } = initData.value;

  const imageRes = await fetch(post.generated.linkedinImageUrl);
  const imageBuf = Buffer.from(await imageRes.arrayBuffer());

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/png",
    },
    body: imageBuf,
  });
  if (!uploadRes.ok) {
    throw new Error(`Falha ao subir imagem pro LinkedIn (HTTP ${uploadRes.status}).`);
  }

  const postRes = await fetch(`${LINKEDIN_API}/rest/posts`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      author,
      commentary: escapeLinkedInText(post.generated.captionLinkedin),
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: { media: { id: imageUrn } },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  if (!postRes.ok) {
    const body = await postRes.text();
    throw new Error(`Falha ao publicar no LinkedIn (HTTP ${postRes.status}): ${body}`);
  }
  const postUrn = postRes.headers.get("x-restli-id");

  return {
    publishedAt: new Date().toISOString(),
    url: postUrn
      ? `https://www.linkedin.com/feed/update/${postUrn}/`
      : "https://www.linkedin.com/",
  };
}
