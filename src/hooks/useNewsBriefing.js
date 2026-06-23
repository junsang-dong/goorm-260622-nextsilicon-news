import { useState } from "react";
import { fetchNews } from "../services/newsApi";
import { callLLM } from "../services/llmApi";
import { buildPrompt } from "../data/prompts";

export function useNewsBriefing() {
  const [articles, setArticles] = useState([]);
  const [insight, setInsight] = useState("");
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [isLoadingLLM, setIsLoadingLLM] = useState(false);
  const [error, setError] = useState(null);

  async function runBriefing(keyword, options = {}) {
    const { llm = "claude", profile = "business", ...newsOptions } = options;

    setError(null);
    setArticles([]);
    setInsight("");

    // Step 1: fetch news
    setIsLoadingNews(true);
    let fetchedArticles = [];
    try {
      fetchedArticles = await fetchNews(keyword, newsOptions);
      setArticles(fetchedArticles);
    } catch (err) {
      setError(err.message);
      setIsLoadingNews(false);
      return;
    }
    setIsLoadingNews(false);

    if (fetchedArticles.length === 0) {
      return;
    }

    // Step 2: LLM analysis
    setIsLoadingLLM(true);
    try {
      const prompt = buildPrompt(fetchedArticles, profile, keyword);
      const result = await callLLM(llm, prompt);
      setInsight(result);
    } catch (err) {
      setError(`AI 분석에 실패했습니다. API Key 또는 한도를 확인해 주세요. (${err.message})`);
    }
    setIsLoadingLLM(false);
  }

  function reset() {
    setArticles([]);
    setInsight("");
    setError(null);
  }

  return {
    articles,
    insight,
    isLoadingNews,
    isLoadingLLM,
    error,
    runBriefing,
    reset,
  };
}
