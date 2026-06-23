import styles from "./ErrorMessage.module.css";

export default function ErrorMessage({ message }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>⚠️</span>
      <p className={styles.text}>{message}</p>
    </div>
  );
}
