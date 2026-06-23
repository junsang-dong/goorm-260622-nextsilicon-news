import styles from "./Header.module.css";
import logoImg from "../../assets/logo.png";

export default function Header() {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <span className={styles.topBarLeft}>반도체 산업 AI 인텔리전스 서비스</span>
        <span className={styles.topBarRight}>{today}</span>
      </div>
      <div className={styles.masthead}>
        <p className={styles.mastheadTag}>SEMICONDUCTOR INTELLIGENCE</p>
        <img src={logoImg} alt="Next Silicon News" className={styles.logoImg} />
        <p className={styles.subtitle}>
          한국 반도체 소재·부품·장비 중소기업·스타트업을 위한 주간 AI 인텔리전스
        </p>
      </div>
      <nav className={styles.sectionNav}>
        <span>CMP·웨이퍼</span>
        <span>공급망</span>
        <span>경쟁사</span>
        <span>전시회</span>
        <span>SiC</span>
        <span>정책</span>
        <span>일본 시장</span>
      </nav>
    </header>
  );
}
