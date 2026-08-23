import styles from "../styles/cartCard.module.css";
import { Icon } from "@iconify/react";
import truncateTitle from "../utils/truncate";
import { CART_ACTIONS, useCart } from "../context/CartContext";

export default function CartCard({
  id,
  title,
  price,
  cartQty,
  img,
}) {
  const { dispatch } = useCart();
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
                  dispatch({
                    type: CART_ACTIONS.DECREASE_QUANTITY,
                    payload: { id },
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
                dispatch({
                  type: CART_ACTIONS.INCREASE_QUANTITY,
                  payload: { id },
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
              dispatch({
                type: CART_ACTIONS.REMOVE_ARTICLE,
                payload: { id },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
