export async function callLLM(llm, prompt) {
  switch (llm) {
    case "claude":
      return callClaude(prompt);
    case "gpt":
      return callGPT(prompt);
    case "gemini":
      return callGemini(prompt);
    default:
      throw new Error(`지원하지 않는 LLM: ${llm}`);
  }
}

async function callClaude(prompt) {
  const response = await fetch("/proxy/anthropic/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": import.meta.env.VITE_CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Claude API 오류 (${response.status})`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callGPT(prompt) {
  const response = await fetch("/proxy/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content:
            "당신은 한국 반도체 산업 전문 애널리스트입니다. 실무자에게 유용한 인사이트를 제공하세요.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `GPT API 오류 (${response.status})`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const response = await fetch(
    `/proxy/gemini/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4096 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.error?.message || `Gemini API 오류 (${response.status})`
    );
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
