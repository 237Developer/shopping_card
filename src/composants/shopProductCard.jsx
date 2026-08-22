import { Icon } from "@iconify/react";
import styles from "../styles/shop-product-card.module.css";
import truncateTitle from "../utils/truncate";
import { useState } from "react";
import { memo } from "react";
import { Link } from "react-router";

const TOTAL_STARS = 5;

// Create one state per star to display a rounded rating out of five.
function getStarStates(rate, totalStars = TOTAL_STARS) {
  const filledCount = Math.min(totalStars, Math.max(0, Math.round(rate)));
  return Array.from({ length: totalStars }, (_, index) => index < filledCount);
}

function ShopCard({
  img,
  title,
  price,
  id,
  description,
  rating = { rate: 0, count: 0 },
  setArticle,
  cartQty = 1,
}) {
  const [qty, setQty] = useState(cartQty);
  const starStates = getStarStates(rating.rate);

  function handleAddToCart() {
    setArticle((prevArticles) => {
      const existingArticle = prevArticles.find((article) => article.id === id);

      if (existingArticle) {
        // The item already exists, so we only update its count.
        return prevArticles.map((article) =>
          article.id === id ? { ...article, count: qty } : article,
        );
      }
      return [...prevArticles, { id, count: qty }];
    });
  }

  return (
    <div className={styles.cardContainer} data-id={id}>
      <div className={styles.top}>
        <img src={img} alt={title} className={styles.image} />

        <div className={styles.info}>
          <h3 className={styles.name}>{truncateTitle(title, 30)}</h3>
          <p className={styles.price}>{price * 200} FCFA</p>

          <div className={styles.rating}>
            {starStates.map((isFilled, index) => (
              <Icon
                key={index}
                icon={isFilled ? "mdi:star" : "mdi:star-outline"}
                className={isFilled ? styles.starFilled : styles.starEmpty}
              />
            ))}
          </div>

          <p className={styles.description}>{truncateTitle(description, 75)}</p>
          <Link to="/shop" className={styles.details}>
            Voir les détails
          </Link>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.quantity}>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => {
              if (qty >= 1) {
                setQty(qty - 1);
              }
            }}
          >
            –
          </button>
          <span className={styles.qtyValue}>{qty}</span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => {
              setQty(qty + 1);
            }}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className={styles.addButton}
          onClick={handleAddToCart}
        >
          <Icon icon="mdi:cart-outline" className={styles.cartIcon} />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export default memo(ShopCard);
