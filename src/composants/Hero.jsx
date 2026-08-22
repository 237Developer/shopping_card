import styles from "../styles/hero.module.css";
import Button from "./Button";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <h2>Les meilleures produits, pour vous.</h2>
      <p>Qualité, simplicité et prix justes.</p>
      <Button text="Découvrir la boutique" />
    </div>
  );
}
