import { useState } from "react";
import styles from "./LikeButton.module.css";

export default function LikeButton({ itemKey }) {
  const storageKey = `nsn_like_${itemKey}`;
  const [liked, setLiked] = useState(() => localStorage.getItem(storageKey) === "1");

  function toggle(e) {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    if (next) localStorage.setItem(storageKey, "1");
    else localStorage.removeItem(storageKey);
  }

  return (
    <button
      className={`${styles.btn} ${liked ? styles.liked : ""}`}
      onClick={toggle}
      title={liked ? "저장 취소" : "저장"}
    >
      {liked ? "♥" : "♡"} {liked ? "저장됨" : "저장"}
    </button>
  );
}
