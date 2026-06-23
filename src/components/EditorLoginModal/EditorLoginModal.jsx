import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./EditorLoginModal.module.css";

export default function EditorLoginModal({ onClose }) {
  const { login } = useAuth();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(pw);
    setLoading(false);
    if (ok) {
      onClose();
    } else {
      setError("비밀번호가 올바르지 않습니다.");
      setPw("");
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Editor 로그인</h2>
        <p className={styles.sub}>관리자만 접근할 수 있습니다.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            className={styles.input}
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn} disabled={loading || !pw}>
            {loading ? "확인 중..." : "로그인"}
          </button>
        </form>
        <button className={styles.cancelBtn} onClick={onClose}>취소</button>
      </div>
    </div>
  );
}
