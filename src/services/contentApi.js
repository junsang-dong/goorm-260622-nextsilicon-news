export function normalizeDbCard(card) {
  return {
    id: card.id,
    title: card.title,
    description: card.description,
    url: card.url,
    source: { name: card.source_name },
    publishedAt: new Date(card.published_at),
    urlToImage: card.url_to_image,
  };
}

export async function fetchPublishedContent() {
  const res = await fetch("/api/content");
  if (!res.ok) throw new Error("콘텐츠 로드 실패");
  const data = await res.json();
  return {
    cards: (data.cards || []).map(normalizeDbCard),
    analysis: data.analysis || null,
  };
}

export async function verifyEditorPassword(password) {
  const res = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-editor-password": password },
    body: JSON.stringify({ action: "verify" }),
  });
  return res.ok;
}

export async function publishCard(card, password) {
  const res = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-editor-password": password },
    body: JSON.stringify({
      action: "add_card",
      card: {
        title: card.title,
        description: card.description,
        url: card.url,
        source_name: card.source?.name || "",
        published_at: card.publishedAt,
        url_to_image: card.urlToImage || "",
      },
    }),
  });
  if (!res.ok) throw new Error("게시 실패");
  return normalizeDbCard(await res.json());
}

export async function deleteCard(id, password) {
  const res = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-editor-password": password },
    body: JSON.stringify({ action: "delete_card", id }),
  });
  if (!res.ok) throw new Error("삭제 실패");
}

export async function publishAnalysis(content, llmName, profileName, password) {
  const res = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-editor-password": password },
    body: JSON.stringify({ action: "save_analysis", content, llm_name: llmName, profile_name: profileName }),
  });
  if (!res.ok) throw new Error("저장 실패");
  return res.json();
}

export async function deleteAnalysis(password) {
  const res = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-editor-password": password },
    body: JSON.stringify({ action: "delete_analysis" }),
  });
  if (!res.ok) throw new Error("삭제 실패");
}
