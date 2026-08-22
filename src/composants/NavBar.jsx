import { Icon } from "@iconify/react";
import styles from "../styles/NavBar.module.css";
import { useNavigate } from "react-router";

export default function NavBar({ openSidebar, nbrOfItems = 5 }) {
  const navigate = useNavigate();
  return (
    <div className={styles.navbar}>
      <Icon
        icon="material-symbols:menu"
        className={styles.icon}
        onClick={() => {
          openSidebar(true);
        }}
      />
      <h1>
        <span>Shop</span>Easy
      </h1>
      <div
        className={styles.iconContainer}
        onClick={() => {
          navigate("/cart");
        }}
      >
        {nbrOfItems ? (
          <span className={styles.nbrOfItems}>{nbrOfItems}</span>
        ) : null}
        <Icon icon="boxicons:cart" className={styles.icon} />
      </div>
    </div>
  );
}
