import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner({ message }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
