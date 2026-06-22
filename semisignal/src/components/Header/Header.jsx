import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>💡</span>
          <span className={styles.title}>SemiSignal</span>
        </div>
        <p className={styles.subtitle}>
          반도체 산업 AI 뉴스 브리핑 — 한국 반도체 중소기업 실무자를 위한 주간 인텔리전스 서비스
        </p>
      </div>
    </header>
  );
}
