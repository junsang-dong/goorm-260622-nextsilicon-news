import LikeButton from "../LikeButton/LikeButton";
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

// onPublish: Editor가 검색 결과를 DB에 게시
// onDelete: Editor가 DB에서 삭제
// likeKey: Reader용 Like 버튼 식별자 (DB card id)
export default function NewsCard({ article, onPublish, onDelete, likeKey }) {
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
        <div className={styles.footer}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            원문 보기 →
          </a>
          <div className={styles.actions}>
            {onPublish && (
              <button className={styles.publishBtn} onClick={onPublish}>
                + 게시
              </button>
            )}
            {onDelete && (
              <button className={styles.deleteBtn} onClick={onDelete}>
                삭제
              </button>
            )}
            {likeKey && <LikeButton itemKey={`card_${likeKey}`} />}
          </div>
        </div>
      </div>
    </article>
  );
}
