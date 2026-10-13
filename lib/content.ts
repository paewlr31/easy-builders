import "server-only";
import { cache } from "react";
import { defaultContent } from "./default-content";
import { ensureReady, getSql } from "./db";
import { sanitizeContent } from "./sanitize";
import type { InboxMessage, SiteContent } from "./types";

export class DatabaseMissingError extends Error {
  constructor() {
    super("NO_DATABASE");
    this.name = "DatabaseMissingError";
  }
}

function stamp(value: unknown) {
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export const getContent = cache(async function getContent(): Promise<SiteContent> {
  try {
    const sql = getSql();
    if (!sql) return defaultContent;
    await ensureReady(sql);
    const rows = await sql`SELECT data FROM site_content WHERE id = 1`;
    if (!rows.length) return defaultContent;
    return sanitizeContent(rows[0].data);
  } catch (error) {
    console.error("getContent", error);
    return defaultContent;
  }
});

export async function getAdminState(): Promise<{ content: SiteContent; updatedAt: string | null; db: boolean }> {
  const sql = getSql();
  if (!sql) return { content: defaultContent, updatedAt: null, db: false };
  await ensureReady(sql);
  const rows = await sql`SELECT data, updated_at FROM site_content WHERE id = 1`;
  if (!rows.length) return { content: defaultContent, updatedAt: null, db: true };
  return {
    content: sanitizeContent(rows[0].data),
    updatedAt: stamp(rows[0].updated_at),
    db: true,
  };
}

export async function saveContent(content: SiteContent) {
  const sql = getSql();
  if (!sql) throw new DatabaseMissingError();
  await ensureReady(sql);
  const payload = JSON.stringify(content);
  const rows = await sql`
    INSERT INTO site_content (id, data, updated_at)
    VALUES (1, ${payload}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    RETURNING updated_at
  `;
  return stamp(rows[0]?.updated_at);
}

export async function addMessage(name: string, email: string, body: string) {
  const sql = getSql();
  if (!sql) throw new DatabaseMissingError();
  await ensureReady(sql);
  await sql`INSERT INTO messages (name, email, body) VALUES (${name}, ${email}, ${body})`;
}

export async function listMessages(): Promise<InboxMessage[]> {
  const sql = getSql();
  if (!sql) throw new DatabaseMissingError();
  await ensureReady(sql);
  const rows = await sql`
    SELECT id, name, email, body, created_at
    FROM messages
    ORDER BY created_at DESC
    LIMIT 200
  `;
  return rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    email: String(row.email),
    body: String(row.body),
    createdAt: stamp(row.created_at) ?? new Date(0).toISOString(),
  }));
}

export async function deleteMessage(id: number) {
  const sql = getSql();
  if (!sql) throw new DatabaseMissingError();
  await ensureReady(sql);
  await sql`DELETE FROM messages WHERE id = ${id}`;
}
