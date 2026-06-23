import { useAuth } from "../../contexts/AuthContext";
import styles from "./EditorBanner.module.css";

export default function EditorBanner() {
  const { logout } = useAuth();
  return (
    <div className={styles.banner}>
      <span className={styles.label}>✏ Editor 모드</span>
      <span className={styles.hint}>기사를 게시하거나 AI 분석을 저장해 독자에게 노출하세요.</span>
      <button className={styles.logoutBtn} onClick={logout}>로그아웃</button>
    </div>
  );
}
