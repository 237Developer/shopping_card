import styles from "../styles/footer.module.css";
import Button from "./Button";
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.header}>
        <p>
          <span>Shop</span>Easy <br /> Des produits de qualité pour simplifier
          vos achats en ligne. Simples, rapides et sécurisées.
        </p>
        <Button text="Découvrir la boutique" />
      </div>
      <div className={styles.followUs}>
        <p>Suivez-nous</p>
        <div>
          <div>
            <Icon icon="line-md:tiktok" className={styles.socialNetworkIcon} />
          </div>
          <div>
            <Icon
              className={styles.socialNetworkIcon}
              icon="line-md:facebook"
            />
          </div>
          <div>
            <Icon className={styles.socialNetworkIcon} icon="mdi:instagram" />
          </div>
        </div>
      </div>

      <div className={styles.help}>
        <div className={styles.helpHeader}>
          <Icon icon="lucide:headset" /> Aide
        </div>
        <a href="#">Contact</a>
        <a href="#">FAQ</a>
        <a href="#">Livraison</a>
      </div>

      <div className={styles.information}>
        <div className={styles.infosHeader}>
          <Icon icon="basil:document-solid" />
          Information
        </div>
        <a href="#">A propos de nous</a>
        <a href="#">Conditions d'utilisation</a>
        <a href="#">Politique de confidentialité</a>
      </div>
      <div className={styles.contact}>
        <div className={styles.contactHeader}>
          <Icon icon="ic:round-phone" />
          Contact
        </div>
        <div>
          <Icon icon="boxicons:location" /> Yaoundé, Cameroun
        </div>
        <div>
          <Icon icon="ic:round-phone" /> 6XX XX XX XX
        </div>
        <div>
          <Icon icon="material-symbols:mail-outline" /> support@shopeasy.com
        </div>
      </div>
      <div className={styles.copyright}>
        <p>
          © 2026 <span>Shop</span>Easy
        </p>
        <p>Tous droits réservés.</p>
      </div>
    </div>
  );
}
