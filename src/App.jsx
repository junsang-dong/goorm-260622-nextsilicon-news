import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header/Header";
import UserProfile from "./components/UserProfile/UserProfile";
import SearchPanel from "./components/SearchPanel/SearchPanel";
import NewsCard from "./components/NewsCard/NewsCard";
import InsightCard from "./components/InsightCard/InsightCard";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import EditorBanner from "./components/EditorBanner/EditorBanner";
import EditorLoginModal from "./components/EditorLoginModal/EditorLoginModal";
import Footer from "./components/Footer/Footer";
import { useAuth } from "./contexts/AuthContext";
import { useNewsBriefing } from "./hooks/useNewsBriefing";
import {
  fetchPublishedContent,
  publishCard,
  deleteCard,
  publishAnalysis,
  deleteAnalysis,
} from "./services/contentApi";
import styles from "./App.module.css";

export default function App() {
  const { isEditor, password } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ── Published content (from Neon DB) ────────────────────────────────────
  const [publishedCards, setPublishedCards] = useState([]);
  const [publishedAnalysis, setPublishedAnalysis] = useState(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [contentError, setContentError] = useState(null);

  // ── Editor search state ──────────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState("business");
  const [selectedLLM, setSelectedLLM] = useState("claude");
  const [insightMeta, setInsightMeta] = useState(null);
  const { articles, insight, isLoadingNews, isLoadingLLM, error: searchError, runBriefing } =
    useNewsBriefing();

  // ── Load published content on mount ─────────────────────────────────────
  const loadContent = useCallback(async () => {
    setIsLoadingContent(true);
    setContentError(null);
    try {
      const { cards, analysis } = await fetchPublishedContent();
      setPublishedCards(cards);
      setPublishedAnalysis(analysis);
    } catch {
      setContentError("콘텐츠를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoadingContent(false);
    }
  }, []);

  useEffect(() => { loadContent(); }, [loadContent]);

  // ── Preferences ──────────────────────────────────────────────────────────
  useEffect(() => {
    const savedProfile = localStorage.getItem("semisignal_profile");
    const savedLLM = localStorage.getItem("semisignal_llm");
    if (savedProfile) setUserProfile(savedProfile);
    if (savedLLM) setSelectedLLM(savedLLM);
  }, []);

  function handleProfileChange(profile) {
    setUserProfile(profile);
    localStorage.setItem("semisignal_profile", profile);
  }

  function handleLLMChange(llm) {
    setSelectedLLM(llm);
    localStorage.setItem("semisignal_llm", llm);
  }

  function handleSearch(keyword, options) {
    const history = JSON.parse(localStorage.getItem("semisignal_history") || "[]");
    const updated = [{ keyword, timestamp: new Date().toISOString() }, ...history].slice(0, 10);
    localStorage.setItem("semisignal_history", JSON.stringify(updated));
    setInsightMeta({ llm: selectedLLM, profile: userProfile, generatedAt: new Date() });
    runBriefing(keyword, { ...options, llm: selectedLLM, profile: userProfile });
  }

  // ── Editor actions ───────────────────────────────────────────────────────
  async function handlePublishCard(article) {
    try {
      const saved = await publishCard(article, password);
      setPublishedCards((prev) => [saved, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteCard(id) {
    if (!window.confirm("이 기사를 삭제하시겠습니까?")) return;
    try {
      await deleteCard(id, password);
      setPublishedCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handlePublishAnalysis() {
    if (!insight || !insightMeta) return;
    try {
      const saved = await publishAnalysis(insight, insightMeta.llm, insightMeta.profile, password);
      setPublishedAnalysis(saved);
      alert("AI 분석이 게시되었습니다.");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteAnalysis() {
    if (!window.confirm("게시된 AI 분석을 삭제하시겠습니까?")) return;
    try {
      await deleteAnalysis(password);
      setPublishedAnalysis(null);
    } catch (err) {
      alert(err.message);
    }
  }

  const isSearchLoading = isLoadingNews || isLoadingLLM;

  // Is this search result already published?
  const publishedUrls = new Set(publishedCards.map((c) => c.url));

  return (
    <div className={styles.app}>
      {isEditor && <EditorBanner />}
      <Header onEditorClick={() => !isEditor && setShowLoginModal(true)} />
      {showLoginModal && <EditorLoginModal onClose={() => setShowLoginModal(false)} />}

      <main className={styles.main}>
        <div className={styles.container}>

          {/* ── Editor: search panel ──────────────────────────────────── */}
          {isEditor && (
            <section className={styles.controls}>
              <UserProfile selectedProfile={userProfile} onProfileChange={handleProfileChange} />
              <SearchPanel
                onSearch={handleSearch}
                selectedLLM={selectedLLM}
                onLLMChange={handleLLMChange}
                isLoading={isSearchLoading}
              />
            </section>
          )}

          {/* ── Editor: search results ────────────────────────────────── */}
          {isEditor && (
            <section className={styles.results}>
              {isLoadingNews && <LoadingSpinner message="💡 뉴스 수집 중..." />}
              {isLoadingLLM && <LoadingSpinner message="🤖 AI 분석 중..." />}
              {searchError && <ErrorMessage message={searchError} />}

              {articles.length > 0 && (
                <>
                  <div className={styles.articlesHeader}>
                    <h2 className={styles.articlesTitle}>검색 결과 ({articles.length}건)</h2>
                    <span className={styles.editorHint}>+ 게시 버튼을 눌러 독자에게 노출하세요</span>
                  </div>
                  <div className={styles.grid}>
                    {articles.map((a) => (
                      <NewsCard
                        key={a.url}
                        article={a}
                        onPublish={publishedUrls.has(a.url) ? undefined : () => handlePublishCard(a)}
                      />
                    ))}
                  </div>
                </>
              )}

              {insight && insightMeta && (
                <InsightCard
                  insight={insight}
                  llmName={insightMeta.llm}
                  profileName={insightMeta.profile}
                  generatedAt={insightMeta.generatedAt}
                  onPublish={handlePublishAnalysis}
                />
              )}
            </section>
          )}

          {/* ── Published content (visible to all) ───────────────────── */}
          <section className={styles.results}>
            {isLoadingContent && <LoadingSpinner message="콘텐츠 로딩 중..." />}
            {contentError && <ErrorMessage message={contentError} />}

            {!isLoadingContent && publishedCards.length === 0 && !publishedAnalysis && !contentError && (
              <div className={styles.empty}>
                {isEditor
                  ? "게시된 콘텐츠가 없습니다. 기사를 검색하고 + 게시 버튼을 눌러 추가하세요."
                  : "아직 게시된 콘텐츠가 없습니다."}
              </div>
            )}

            {publishedAnalysis && (
              <InsightCard
                insight={publishedAnalysis.content}
                llmName={publishedAnalysis.llm_name}
                profileName={publishedAnalysis.profile_name}
                generatedAt={new Date(publishedAnalysis.created_at)}
                onDelete={isEditor ? handleDeleteAnalysis : undefined}
                likeKey={isEditor ? undefined : publishedAnalysis.id}
              />
            )}

            {publishedCards.length > 0 && (
              <>
                <div className={styles.articlesHeader}>
                  <h2 className={styles.articlesTitle}>
                    {isEditor ? `게시된 기사 (${publishedCards.length}건)` : `수집된 뉴스 (${publishedCards.length}건)`}
                  </h2>
                </div>
                <div className={styles.grid}>
                  {publishedCards.map((c) => (
                    <NewsCard
                      key={c.id}
                      article={c}
                      onDelete={isEditor ? () => handleDeleteCard(c.id) : undefined}
                      likeKey={isEditor ? undefined : c.id}
                    />
                  ))}
                </div>
              </>
            )}
          </section>

        </div>
      </main>
      <Footer onEditorClick={() => !isEditor && setShowLoginModal(true)} />
    </div>
  );
}
