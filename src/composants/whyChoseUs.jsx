import styles from "../styles/why-chose-us.module.css";
import { Icon } from "@iconify/react";

export default function WhyChoseUs() {
  return (
    <div className={styles.whyChoseUs}>
      <div className={styles.head}>
        <h3>
          Pourquoi choisir <span>Shop</span>Easy ?
        </h3>
        <p>Nous nous engageons à vous offire la meilleur expérience d'achat.</p>
      </div>
      <div>
        <Card
          icon="mdi:truck-outline"
          title="Livraison rapide"
          description="Recevez vos commande dans les meilleurs délais, partout où vous êtes."
        />
        <Card
          icon="mdi:shield-check-outline"
          title="Livraison rapide"
          description="Recevez vos commande dans les meilleurs délais, partout où vous êtes."
        />
        <Card
          icon="flowbite:badge-check-outline"
          title="Produits sélectionnés"
          description="Nous sélectionnons pour vous des produits de qualité au meilleur prix."
        />
        <Card
          icon="basil:headset-outline"
          title="Livraison rapide"
          description="Notre équipe est disponible tous les jours pour répondre à vos questions."
        />
      </div>
    </div>
  );
}

function Card({ icon, title, description }) {
  return (
    <div className={styles.card}>
      <div>
        <Icon icon={icon} className={styles.icon}/>
      </div>
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}
