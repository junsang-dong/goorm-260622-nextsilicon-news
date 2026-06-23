import { useState } from "react";
import LikeButton from "../LikeButton/LikeButton";
import styles from "./InsightCard.module.css";

const LLM_LABELS = { claude: "Claude", gpt: "GPT-4o", gemini: "Gemini" };
const PROFILE_LABELS = {
  business: "사업기획",
  marketing: "영업·마케팅",
  rnd: "R&D",
  production: "생산·품질",
  executive: "경영진",
};

function renderMarkdown(text) {
  const lines = text.split("\n");
  const html = [];
  let inUl = false;
  let inOl = false;

  function closeList() {
    if (inUl) { html.push("</ul>"); inUl = false; }
    if (inOl) { html.push("</ol>"); inOl = false; }
  }

  function inlineFormat(str) {
    return str
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^---+$/.test(line.trim())) {
      closeList(); html.push(`<hr/>`);
    } else if (/^## (.+)/.test(line)) {
      closeList(); html.push(`<h2>${inlineFormat(line.replace(/^## /, ""))}</h2>`);
    } else if (/^### (.+)/.test(line)) {
      closeList(); html.push(`<h3>${inlineFormat(line.replace(/^### /, ""))}</h3>`);
    } else if (/^- \[ \] (.+)/.test(line)) {
      if (!inUl) { html.push("<ul class='checklist'>"); inUl = true; }
      html.push(`<li><label><input type="checkbox" disabled /> ${inlineFormat(line.replace(/^- \[ \] /, ""))}</label></li>`);
    } else if (/^- (.+)/.test(line)) {
      if (!inUl) { html.push("<ul>"); inUl = true; }
      html.push(`<li>${inlineFormat(line.replace(/^- /, ""))}</li>`);
    } else if (/^\d+\. (.+)/.test(line)) {
      if (!inOl) { html.push("<ol>"); inOl = true; }
      html.push(`<li>${inlineFormat(line.replace(/^\d+\. /, ""))}</li>`);
    } else if (line === "") {
      closeList(); html.push("<br/>");
    } else {
      closeList(); html.push(`<p>${inlineFormat(line)}</p>`);
    }
  }
  closeList();
  return html.join("\n");
}

// onPublish: Editor가 현재 분석 결과를 DB에 저장
// onDelete: Editor가 DB에서 분석 삭제
// likeKey: Reader용 Like 키 (analysis DB id)
export default function InsightCard({ insight, llmName, profileName, generatedAt, onPublish, onDelete, likeKey }) {
  const [viewMode, setViewMode] = useState("web");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(insight);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([insight], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = generatedAt
      ? generatedAt.toISOString().slice(0, 10)
      : "insight";
    a.href = url;
    a.download = `nextsilicon-${dateStr}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const timeStr = generatedAt
    ? generatedAt.toLocaleString("ko-KR", { hour12: false })
    : "";

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.left}>
          <span className={styles.badge}>{LLM_LABELS[llmName] || llmName}</span>
          <span className={`${styles.badge} ${styles.badgeProfile}`}>
            {PROFILE_LABELS[profileName] || profileName}
          </span>
        </div>
        <div className={styles.right}>
          <span className={styles.time}>{timeStr}</span>

          <div className={styles.modeToggle}>
            <button
              className={`${styles.modeBtn} ${viewMode === "web" ? styles.modeBtnActive : ""}`}
              onClick={() => setViewMode("web")}
            >웹뷰</button>
            <button
              className={`${styles.modeBtn} ${viewMode === "markdown" ? styles.modeBtnActive : ""}`}
              onClick={() => setViewMode("markdown")}
            >마크다운</button>
          </div>

          <button
            className={`${styles.actionBtn} ${copied ? styles.copied : ""}`}
            onClick={handleCopy}
          >{copied ? "✓ 복사됨" : "📋 복사"}</button>
          <button className={styles.actionBtn} onClick={handleDownload}>
            ⬇ 다운로드
          </button>

          {/* Editor: 게시 / 삭제 */}
          {onPublish && (
            <button className={`${styles.actionBtn} ${styles.publishBtn}`} onClick={onPublish}>
              ✓ 게시
            </button>
          )}
          {onDelete && (
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={onDelete}>
              삭제
            </button>
          )}

          {/* Reader: Like */}
          {likeKey && <LikeButton itemKey={`analysis_${likeKey}`} />}
        </div>
      </div>

      {viewMode === "web" ? (
        <div
          className={styles.webView}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(insight) }}
        />
      ) : (
        <pre className={styles.markdownView}>{insight}</pre>
      )}
    </div>
  );
}
