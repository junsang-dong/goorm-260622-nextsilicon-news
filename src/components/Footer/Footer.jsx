import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>
        &copy; 2026{" "}
        <a
          href="https://nextplatform.net"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          NextPlatform
        </a>
        {" "}· Deployed 2026.6.22 · Built with React / Vite / Claude API / NewsAPI
      </span>
    </footer>
  );
}
