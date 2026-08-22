import styles from "../styles/cartCard.module.css";
import { Icon } from "@iconify/react";
import truncateTitle from "../utils/truncate";

export default function CartCard({
  id,
  title,
  price,
  cartQty,
  img,
  setArticle,
}) {
  return (
    <div className={styles.cardContainer}>
      <img src={img} alt="T-shirt Basique" className={styles.image} />
      <div>
        <div className={styles.info}>
          <h3 className={styles.title}>{truncateTitle(title, 40)}</h3>
          <p className={styles.price}>{price} FCFA</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.quantity}>
            <button
              type="button"
              className={styles.qtyBtn}
              onClick={() => {
                if (cartQty >= 1) {
                  setArticle((prevArticles) => {
                    return prevArticles.map((article) =>
                      article.id === id
                        ? { ...article, count: cartQty - 1 }
                        : article,
                    );
                  });
                }
              }}
            >
              –
            </button>
            <span className={styles.qtyValue} data-testid="test-qty">
              {cartQty}
            </span>
            <button
              type="button"
              className={styles.qtyBtn}
              onClick={() => {
                setArticle((prevArticles) => {
                  return prevArticles.map((article) =>
                    article.id === id
                      ? { ...article, count: cartQty + 1 }
                      : article,
                  );
                });
              }}
            >
              +
            </button>
          </div>
          <Icon
            icon="fluent:delete-32-regular"
            className={styles.delButton}
            onClick={() => {
              setArticle((prevArticles) => {
                return prevArticles.filter((elt) => elt.id !== id);
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
