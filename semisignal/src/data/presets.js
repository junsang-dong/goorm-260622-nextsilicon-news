export const KEYWORD_PRESETS = {
  cmp_wafer: {
    label: "💬 CMP·웨이퍼",
    query: '(silicon wafer OR "CMP polishing" OR "wafer coating") AND semiconductor',
    description: "웨이퍼 연마·코팅·표면처리 기술 뉴스",
  },
  supply_chain: {
    label: "🏭 공급망·시장",
    query: '("semiconductor materials" OR "wafer supply") AND (Korea OR Japan OR Taiwan)',
    description: "한·일·대만 반도체 소재 공급망 동향",
  },
  competitor: {
    label: "🏢 경쟁사 동향",
    query: '"SK Siltron" OR "Shin-Etsu" OR "SUMCO" OR "GlobalWafers" OR "SKC semiconductor"',
    description: "국내외 웨이퍼·소재 주요 기업 뉴스",
  },
  exhibition: {
    label: "🎪 Semicon 전시회",
    query: '"Semicon Japan" OR "SEMICON Korea" OR "semiconductor exhibition" 2026',
    description: "반도체 국제 전시회·컨퍼런스 일정 및 동향",
  },
  sic_advanced: {
    label: "⚡ SiC·차세대 소재",
    query: '("SiC wafer" OR "silicon carbide" OR "GaN substrate") AND (supply OR market OR production)',
    description: "SiC·GaN 등 차세대 전력반도체 소재 동향",
  },
  policy_regulation: {
    label: "📋 정책·규제",
    query: '(semiconductor AND (Korea OR "South Korea")) AND (policy OR regulation OR subsidy OR "CHIPS Act")',
    description: "한국 반도체 정책·지원금·수출규제 동향",
  },
  japan_market: {
    label: "🗾 일본 시장",
    query: '"Japan semiconductor" AND (materials OR wafer OR supply OR export)',
    description: "일본 반도체 소재 시장 및 수출 동향",
  },
};
