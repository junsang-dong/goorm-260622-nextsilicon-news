export function buildPrompt(articles, profile, keyword) {
  const articleText = articles
    .map(
      (a, i) =>
        `[${i + 1}] ${a.title}\n출처: ${a.source.name} | ${a.publishedAt}\n요약: ${a.description}`
    )
    .join("\n\n");

  const personas = {
    business:
      "한국 반도체 소재 중소기업(연매출 100억 내외, 일본 수출 개선 중)의 사업기획팀장",
    marketing:
      "한국 반도체 소재 중소기업의 영업마케팅팀장 (일본·대만 시장 개척 담당)",
    rnd: "한국 반도체 소재 중소기업의 R&D팀장 (재료공학 박사, 공정 기술 전문가)",
    production:
      "한국 반도체 소재 중소기업의 생산·품질 파트장 (현장 15년 경력)",
    executive:
      "한국 반도체 소재 중소기업의 대표이사 (창업 5년차, 글로벌 진출 준비 중)",
  };

  const focuses = {
    business: "시장 기회·경쟁 위협·사업 타당성·IR 자료 활용",
    marketing: "영업 기회·고객 인사이트·전시회 참가 전략·현지화 포인트",
    rnd: "기술 트렌드·특허 동향·공정 개선 아이디어·연구 협력 기회",
    production: "공급망 안정성·소재 수급·품질 기준 변화·원가 영향",
    executive: "경영 리스크·투자 기회·인수 전략·글로벌 진출 방향",
  };

  return `
당신은 ${personas[profile]}입니다.

아래 반도체 산업 관련 뉴스 기사를 분석하여 당신의 직무 관점에서 실무에 즉시 활용 가능한 인사이트를 제공하세요.
검색 키워드: "${keyword}"
관심 포커스: ${focuses[profile]}

=== 수집된 뉴스 기사 (${articles.length}건) ===
${articleText}
===========================================

다음 형식으로 정확히 답변하세요:

## 📰 이번 주 핵심 동향 (3줄 요약)
-
-
-

## 💼 우리 회사 적용 포인트
1.
2.
3.

## ⚠️ 주목해야 할 리스크
-

## 📋 이번 주 액션 아이템
- [ ]

답변은 한국어로 작성하되, 기업명·기술 용어는 영문을 유지하세요.
`.trim();
}
