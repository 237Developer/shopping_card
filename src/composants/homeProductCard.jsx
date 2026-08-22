import { Icon } from "@iconify/react";
import styles from "../styles/home-product-card.module.css";

export default function HomeProductCard({ img, price, title, id }) {
  return (
    <div className={styles.HomeProductCard} data-id={id}>
      <img src={img} alt="product-card" className={styles.productImage} />
      <h4>{title}</h4>
      <div className={styles.price}>
        <span>{price * 200} FCFA</span>{" "}
        <Icon icon="boxicons:cart" className={styles.icon} />
      </div>
    </div>
  );
}
