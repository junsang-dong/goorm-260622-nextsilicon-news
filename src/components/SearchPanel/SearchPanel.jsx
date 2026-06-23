import { useState } from "react";
import { KEYWORD_PRESETS } from "../../data/presets";
import styles from "./SearchPanel.module.css";

const LLM_OPTIONS = [
  { value: "claude",  label: "Claude" },
  { value: "gpt",     label: "GPT-4o" },
  { value: "gemini",  label: "Gemini" },
];

const PERIOD_OPTIONS = [
  { value: "7",  label: "최근 7일" },
  { value: "14", label: "최근 14일" },
  { value: "30", label: "최근 30일" },
];

const LANG_OPTIONS = [
  { value: "en", label: "영문" },
  { value: "ko", label: "한국어" },
];

export default function SearchPanel({
  onSearch,
  selectedLLM,
  onLLMChange,
  isLoading,
}) {
  const [customKeyword, setCustomKeyword] = useState("");
  const [activePreset, setActivePreset] = useState(null);
  const [period, setPeriod] = useState("7");
  const [language, setLanguage] = useState("en");

  function handlePresetClick(key) {
    setActivePreset(key);
    setCustomKeyword("");
  }

  function getFromDate(days) {
    const d = new Date();
    d.setDate(d.getDate() - Number(days));
    return d.toISOString().split("T")[0];
  }

  function handleSearch() {
    const keyword =
      activePreset
        ? KEYWORD_PRESETS[activePreset].query
        : customKeyword.trim();

    if (!keyword) return;

    onSearch(keyword, {
      llm: selectedLLM,
      language,
      from: getFromDate(period),
      pageSize: 10,
    });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  const displayKeyword = activePreset
    ? KEYWORD_PRESETS[activePreset].query
    : customKeyword;

  return (
    <div className={styles.panel}>
      {/* Preset buttons */}
      <div className={styles.presets}>
        {Object.entries(KEYWORD_PRESETS).map(([key, { label, description }]) => (
          <button
            key={key}
            className={`${styles.preset} ${activePreset === key ? styles.presetActive : ""}`}
            onClick={() => handlePresetClick(key)}
            title={description}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Keyword input */}
      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="키워드를 직접 입력하세요 (예: silicon wafer Korea)"
          value={activePreset ? "" : customKeyword}
          onChange={(e) => {
            setActivePreset(null);
            setCustomKeyword(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          className={styles.searchBtn}
          onClick={handleSearch}
          disabled={isLoading || (!activePreset && !customKeyword.trim())}
        >
          {isLoading ? "분석 중..." : "검색"}
        </button>
      </div>

      {/* Active keyword display */}
      {activePreset && (
        <div className={styles.activeQuery}>
          <span className={styles.queryLabel}>검색 쿼리:</span>
          <span className={styles.queryText}>{KEYWORD_PRESETS[activePreset].query}</span>
          <button className={styles.clearBtn} onClick={() => setActivePreset(null)}>✕</button>
        </div>
      )}

      {/* Options row */}
      <div className={styles.options}>
        <label className={styles.optionGroup}>
          <span>LLM</span>
          <select
            value={selectedLLM}
            onChange={(e) => onLLMChange(e.target.value)}
            disabled={isLoading}
            className={styles.select}
          >
            {LLM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.optionGroup}>
          <span>기간</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            disabled={isLoading}
            className={styles.select}
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.optionGroup}>
          <span>언어</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isLoading}
            className={styles.select}
          >
            {LANG_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
