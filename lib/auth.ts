const SALT = "carrosseis-copiloto-dash-v1";

export async function tokenFor(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${SALT}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidToken(token: string | undefined): Promise<boolean> {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected || !token) return false;
  return token === (await tokenFor(expected));
}
