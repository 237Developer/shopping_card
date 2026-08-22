import styles from "../styles/home-products.module.css";
import { NavLink } from "react-router";
import HomeProductCard from "./homeProductCard";
import Button from "./Button";
import getRandomItems from "../utils/getRandomItems";
import truncateTitle from "../utils/truncate";

export default function HomeProduct({ data }) {
  const popularProducts = getRandomItems(data, 6);
  const starProducts = getRandomItems(data, 6);

  return (
    <div className={styles.homeProducts}>
      <div className={styles.popular}>
        <h3>Produits populaires</h3>
        <NavLink to="/shop" className={styles.link}>
          Voir tout
        </NavLink>
      </div>
      <div className={styles.productContainer}>
        {popularProducts &&
          popularProducts.map((elt) => {
            const { id, title, price, image } = elt;
            return (
              <HomeProductCard
                key={id}
                img={image}
                title={truncateTitle(title)}
                price={price}
                id={id}
              />
            );
          })}
      </div>
      <Button text="Aller à la Boutique" className={styles.alignRight} />
      <div className={styles.star}>
        <h3>Produits en Vedette</h3>
        <NavLink to="/shop" className={styles.link}>
          Voir tout
        </NavLink>
      </div>
      <div className={styles.productContainer}>
        {starProducts &&
          starProducts.map((elt) => {
            const { id, title, price, image } = elt;
            return (
              <HomeProductCard
                key={id}
                img={image}
                title={truncateTitle(title)}
                price={price}
                id={id}
              />
            );
          })}
      </div>
    </div>
  );
}
