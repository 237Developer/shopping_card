import { NavLink } from "react-router";
import { Icon } from "@iconify/react";
import styles from "../styles/sidebar.module.css";

export default function Sidebar({ closeSidebar }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.logo}>
          Shop<span>Easy</span>
        </h2>

        <button
          className={styles.closeButton}
          onClick={() => {
            closeSidebar(false);
          }}
        >
          <Icon icon="lucide:x" />
        </button>
      </div>

      <nav className={styles.navigation}>
        <NavLink
          to="/"
          className={styles.link}
          onClick={() => {
            closeSidebar(false);
          }}
        >
          <Icon icon="lucide:house" />
          <span>Accueil</span>
        </NavLink>

        <NavLink
          to="/shop"
          className={styles.link}
          onClick={() => {
            closeSidebar(false);
          }}
        >
          <Icon icon="lucide:store" />
          <span>Boutique</span>
        </NavLink>

        <NavLink
          to="/cart"
          className={styles.link}
          onClick={() => {
            closeSidebar(false);
          }}
        >
          <Icon icon="lucide:shopping-cart" />
          <span>Panier</span>
        </NavLink>

        <NavLink
          to="/contact"
          className={styles.link}
          onClick={() => {
            closeSidebar(false);
          }}
        >
          <Icon icon="lucide:mail" />
          <span>Nous contacter</span>
        </NavLink>
      </nav>

      <div className={styles.bottom}>
        <p>Simple. Rapide. Sécurisé.</p>
      </div>
    </aside>
  );
}
