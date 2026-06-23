export default async function handler(req, res) {
  const { q, language, sortBy, pageSize, from } = req.query;

  const params = new URLSearchParams({
    q,
    language,
    sortBy,
    pageSize,
    apiKey: process.env.VITE_NEWS_API_KEY,
  });
  if (from) params.append("from", from);

  const upstream = await fetch(`https://newsapi.org/v2/everything?${params}`);
  const data = await upstream.json();

  res.status(upstream.status).json(data);
}
