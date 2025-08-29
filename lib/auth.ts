import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE = process.env.COOKIE_NAME || "raileats_token";

export function sign(uid: string) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ uid }, secret, { expiresIn: "7d" });
}

export function getUid(): string | null {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as { uid: string };
    return payload.uid;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/" });
}

export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE);
}
