import styles from "./NewsCard.module.css";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

function truncate(text, max) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

export default function NewsCard({ article }) {
  const { title, description, url, source, publishedAt, urlToImage } = article;

  return (
    <article className={styles.card}>
      {urlToImage ? (
        <img
          src={urlToImage}
          alt=""
          className={styles.thumbnail}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <div className={styles.placeholder}>📰</div>
      )}
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.source}>{source.name}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.time}>{timeAgo(publishedAt)}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{truncate(description, 150)}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          원문 보기 →
        </a>
      </div>
    </article>
  );
}
