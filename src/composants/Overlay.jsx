import styles from "../styles/overlay.module.css";

export default function Overlay({ closeSidebar }) {
  return (
    <div
      className={styles.overlay}
      onClick={() => {
        closeSidebar(false);
      }}
    ></div>
  );
}
