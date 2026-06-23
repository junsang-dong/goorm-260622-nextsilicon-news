# Next Silicon News

한국 반도체 소재·부품·장비(소부장) 중소기업·스타트업을 위한  
AI 기반 주간 인텔리전스 서비스

구름 AI 어시스턴트 교육과정 Day 9 실습 프로젝트  
기술 명세서 작성: Jay(수강생) + Claude(AI) | 빌드: Claude Code

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 키워드 프리셋 | 반도체 산업 특화 7종 (CMP·웨이퍼, 공급망, 경쟁사, 전시회, SiC, 정책, 일본 시장) |
| 직무 프로필 | 사업기획 / 영업·마케팅 / R&D / 생산·품질 / 경영진 — 직무별 맞춤 프롬프트 자동 생성 |
| 멀티 LLM | Claude / GPT-4o / Gemini 선택 가능 |
| AI 인사이트 | 웹뷰(마크다운 렌더링) / 마크다운 원문 토글 보기 |
| 복사·다운로드 | 인사이트를 클립보드 복사 또는 `.md` 파일로 저장 |
| 검색 히스토리 | localStorage 자동 저장 (최대 10건) |

---

## 빠른 시작

```bash
git clone https://github.com/junsang-dong/goorm-260622-nextsilicon-news.git
cd goorm-260622-nextsilicon-news
cp .env.example .env
# .env 파일에 API Key 입력
npm install
npm run dev
# → http://localhost:5173
```

---

## API Key 발급

| 서비스 | 발급 링크 | 무료 한도 |
|--------|----------|---------|
| NewsAPI | https://newsapi.org/register | 100건/일 |
| Claude | https://console.anthropic.com/ | 사용량 기반 |
| GPT | https://platform.openai.com/api-keys | 사용량 기반 |
| Gemini | https://aistudio.google.com/app/apikey | 무료 티어 있음 |

---

## 기술 스택

- **프레임워크:** React 19 + Vite 8
- **스타일:** CSS Modules (추가 패키지 없음)
- **HTTP:** Fetch API (브라우저 내장)
- **상태 관리:** React useState / useEffect
- **배포 대상:** Vercel / Netlify (정적 빌드)

---

## 빌드 명령

```bash
npm run dev      # 개발 서버 (기본 포트 5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

---

## 트러블슈팅 기록

### 3. NewsAPI 프로덕션 차단 — `426 Upgrade Required`

**증상:** Vercel 배포 후 뉴스 수집 단계에서 `426 (Upgrade Required)` 오류  
**원인:** NewsAPI 무료 플랜은 `localhost`에서의 브라우저 직접 호출만 허용. 배포 도메인에서 브라우저가 `newsapi.org`를 직접 호출하면 차단  
**해결:** Vercel 서버리스 함수(`/api/news.js`)를 추가해 NewsAPI 호출을 서버 사이드로 이동. 개발 환경은 `vite.config.js` 프록시로 동일한 `/api/news` 경로를 처리

```
브라우저 → /api/news
  ├── 개발(localhost): Vite 프록시 → newsapi.org (apiKey 서버에서 주입)
  └── 배포(Vercel):   서버리스 함수 → newsapi.org (apiKey 환경변수에서 주입)
```

**변경 파일:**
- `api/news.js` 신규 생성 (Vercel 서버리스 함수)
- `src/services/newsApi.js` — `BASE_URL`을 `/api/news`로 변경, 클라이언트에서 apiKey 제거
- `vite.config.js` — `/api/news` 프록시 추가 (`loadEnv`로 apiKey 서버 주입)

> ⚠️ **Vercel 환경변수 설정 필요:** Vercel 대시보드에서 `VITE_NEWS_API_KEY` 환경변수가 등록되어야 서버리스 함수가 동작합니다.

### 1. LLM API CORS 오류 — `Failed to fetch`

**증상:** 뉴스 수집은 성공, AI 분석에서 `Failed to fetch` 오류  
**원인:** 브라우저에서 `api.anthropic.com` 등 LLM API에 직접 요청 시 CORS 정책으로 차단  
**해결:** `vite.config.js`에 `server.proxy` 설정 추가 — 브라우저 요청을 Vite 개발 서버가 중계

```js
// vite.config.js
server: {
  proxy: {
    '/proxy/anthropic': { target: 'https://api.anthropic.com', changeOrigin: true, ... },
    '/proxy/openai':    { target: 'https://api.openai.com',    changeOrigin: true, ... },
    '/proxy/gemini':    { target: 'https://generativelanguage.googleapis.com', changeOrigin: true, ... },
  }
}
```

### 2. Claude API 헤더 누락 — `CORS requests must set 'anthropic-dangerous-direct-browser-access' header`

**증상:** 프록시 설정 후에도 Claude API 호출 실패  
**원인:** Anthropic은 브라우저 발신 요청에 `anthropic-dangerous-direct-browser-access: true` 헤더를 필수 요구  
**해결:** `llmApi.js`의 Claude 요청 헤더에 해당 항목 추가

```js
headers: {
  "x-api-key": import.meta.env.VITE_CLAUDE_API_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",  // ← 추가
  "content-type": "application/json",
}
```

> ⚠️ **보안 주의:** API Key가 클라이언트 코드에 노출됩니다. 프로덕션 환경에서는 백엔드 서버를 통해 Key를 숨기세요.

---

## 주요 업데이트 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-06-22 | 초기 빌드 완료 (뉴스 수집 + LLM 분석 파이프라인) |
| v1.1 | 2026-06-22 | CORS 오류 수정 (Vite 프록시 설정) |
| v1.2 | 2026-06-22 | Claude API 헤더 누락 오류 수정 |
| v1.3 | 2026-06-22 | AI 인사이트 웹뷰/마크다운 토글, 복사·다운로드 기능 추가 |
| v2.0 | 2026-06-23 | 브랜드명 변경 (SemiSignal → Next Silicon News), NYT 스타일 UI 전면 리디자인 |
| v2.1 | 2026-06-23 | Old English 세리프 로고 이미지 적용, `---` 웹뷰 렌더링 수정, max_tokens 4096으로 증가 |
| v2.2 | 2026-06-23 | 로고 v1 교체, 모듈 순서 변경(뉴스→AI분석), AI분석 간격 축소, 푸터 추가 |
| v2.3 | 2026-06-23 | Vercel 배포 환경 NewsAPI 426 오류 수정 (서버리스 함수 프록시 도입) |

---

## 프로젝트 구조

```
goorm-260622-nextsilicon-news/
├── api/
│   └── news.js                  # Vercel 서버리스 함수 (NewsAPI 프록시)
├── src/
│   ├── assets/
│   │   └── logo.png             # Next Silicon News 로고
│   ├── components/
│   │   ├── Header/              # 서비스 헤더 (NYT 스타일 마스트헤드)
│   │   ├── Footer/              # 푸터 (개발사·배포일·스택)
│   │   ├── UserProfile/         # 직무 프로필 탭
│   │   ├── SearchPanel/         # 키워드 검색 + 옵션
│   │   ├── InsightCard/         # AI 인사이트 (웹뷰/마크다운)
│   │   ├── NewsCard/            # 개별 기사 카드
│   │   ├── LoadingSpinner/      # 로딩 표시
│   │   └── ErrorMessage/        # 오류 메시지
│   ├── services/
│   │   ├── newsApi.js           # NewsAPI 호출
│   │   └── llmApi.js            # Claude / GPT / Gemini 통합 인터페이스
│   ├── data/
│   │   ├── presets.js           # 키워드 프리셋 정의
│   │   └── prompts.js           # 직무별 LLM 프롬프트 빌더
│   ├── hooks/
│   │   └── useNewsBriefing.js   # 뉴스→LLM 파이프라인 커스텀 훅
│   └── App.jsx
├── .env.example                 # 환경 변수 템플릿
└── vite.config.js               # Vite 설정 (프록시 포함)
```

---

## 개발

개발사: [NextPlatform](https://nextplatform.net)  
배포일: 2026-06-22  
라이선스: MIT
