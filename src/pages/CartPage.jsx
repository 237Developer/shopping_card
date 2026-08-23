import styles from "../styles/cart-page.module.css";
import { useOutletContext } from "react-router";

import CartCard from "../composants/cartCard";
import Button from "../composants/Button";
import { useCart } from "../context/CartContext";

function findElement(arr, id) {
  return arr.find((elt) => elt.id === id);
}

export default function CartPage() {
  const { data } = useOutletContext();
  const { cartArticles } = useCart();
  return (
    <div className={styles.container}>
      <div className={styles.total}>
        <p>
          <span className={styles.totalTitle}>Sous-total</span> (4 articles)
        </p>
        <span className={styles.totalPrice}>
          {cartArticles.reduce(
            (acc, elt) =>
              acc + findElement(data, elt.id).price * 200 * elt.count, // we customize price by multiplying by 200
            0,
          )}{" "}
          FCFA
        </span>
      </div>
      <Button className={styles.buyBtn} text="Payer Maintenant" />
      <p className={styles.yourArticles}>Vos Articles</p>
      <div className={styles.cardContainer}>
        {cartArticles.length !== 0 ? (
          cartArticles.map((elt) => {
            const dataElt = findElement(data, elt.id);
            return (
              <CartCard
                key={elt.id}
                id={elt.id}
                title={dataElt.title}
                price={dataElt.price * 200}
                img={dataElt.image}
                cartQty={elt.count}
              />
            );
          })
        ) : (
          <p>Pas d'articles</p>
        )}
      </div>
    </div>
  );
}
