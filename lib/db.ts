import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { defaultContent } from "./default-content";

export type Sql = NeonQueryFunction<false, false>;

const globalState = globalThis as unknown as { easyBuildersReady?: Promise<void> };

export function getSql() {
  const url = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "");
  if (!url) return null;
  return neon(url);
}

async function init(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id integer PRIMARY KEY,
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL,
      body text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at DESC)`;
  await sql`
    INSERT INTO site_content (id, data)
    VALUES (1, ${JSON.stringify(defaultContent)}::jsonb)
    ON CONFLICT (id) DO NOTHING
  `;
}

export function ensureReady(sql: Sql) {
  if (!globalState.easyBuildersReady) {
    globalState.easyBuildersReady = init(sql).catch((error) => {
      globalState.easyBuildersReady = undefined;
      throw error;
    });
  }
  return globalState.easyBuildersReady;
}
