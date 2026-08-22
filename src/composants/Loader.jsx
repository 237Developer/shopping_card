import styles from "../styles/loader.module.css";

export default function Loader({ label = "Chargement..." }) {
  return (
    <div className={styles.container}>
      <div className={styles.loaderWrapper} role="status" aria-live="polite">
        <div className={styles.dots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
        <span className={styles.srOnly}>{label}</span>
      </div>
    </div>
  );
}
