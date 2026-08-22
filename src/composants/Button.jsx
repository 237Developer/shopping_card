import styles from "../styles/button.module.css";
import { NavLink } from "react-router";

export default function Button({ text, className = "" }) {
  return (
    <NavLink to="/shop" className={`${styles.defaultBtn} ${className}`}>
      {text}
    </NavLink>
  );
}
