import { neon } from "@neondatabase/serverless";

async function getDb() {
  const sql = neon(process.env.DATABASE_URL);

  // Create tables if they don't exist (idempotent)
  await sql`
    CREATE TABLE IF NOT EXISTS news_cards (
      id        SERIAL PRIMARY KEY,
      title     TEXT NOT NULL,
      description TEXT,
      url       TEXT,
      source_name TEXT,
      published_at TIMESTAMPTZ,
      url_to_image TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS ai_analyses (
      id          SERIAL PRIMARY KEY,
      content     TEXT NOT NULL,
      llm_name    TEXT,
      profile_name TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  return sql;
}

function verifyPassword(req) {
  return req.headers["x-editor-password"] === process.env.EDITOR_PASSWORD;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const sql = await getDb();

  // ── GET: fetch published content ──────────────────────────────────────────
  if (req.method === "GET") {
    const cards = await sql`
      SELECT * FROM news_cards ORDER BY published_at DESC
    `;
    const analyses = await sql`
      SELECT * FROM ai_analyses ORDER BY created_at DESC LIMIT 1
    `;
    return res.status(200).json({ cards, analysis: analyses[0] ?? null });
  }

  // ── POST: mutations (Editor-only) ────────────────────────────────────────
  if (req.method === "POST") {
    const { action, ...body } = req.body;

    // Password-free: verify action
    if (action === "verify") {
      if (!verifyPassword(req)) return res.status(401).json({ error: "인증 실패" });
      return res.status(200).json({ ok: true });
    }

    if (!verifyPassword(req)) return res.status(401).json({ error: "인증 실패" });

    switch (action) {
      case "add_card": {
        const { title, description, url, source_name, published_at, url_to_image } = body.card;
        const rows = await sql`
          INSERT INTO news_cards (title, description, url, source_name, published_at, url_to_image)
          VALUES (${title}, ${description}, ${url}, ${source_name}, ${published_at}, ${url_to_image})
          RETURNING *
        `;
        return res.status(200).json(rows[0]);
      }
      case "delete_card": {
        await sql`DELETE FROM news_cards WHERE id = ${body.id}`;
        return res.status(200).json({ ok: true });
      }
      case "save_analysis": {
        await sql`DELETE FROM ai_analyses`;
        const rows = await sql`
          INSERT INTO ai_analyses (content, llm_name, profile_name)
          VALUES (${body.content}, ${body.llm_name}, ${body.profile_name})
          RETURNING *
        `;
        return res.status(200).json(rows[0]);
      }
      case "delete_analysis": {
        await sql`DELETE FROM ai_analyses`;
        return res.status(200).json({ ok: true });
      }
      default:
        return res.status(400).json({ error: "알 수 없는 action" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
