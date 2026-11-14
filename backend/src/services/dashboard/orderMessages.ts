export type OrderStatus =
  | "confirmed"
  | "preparing"
  | "shipped"
  | "outForDelivery"
  | "delivered"
  | "cancelled";

interface OrderMessage {
  subject: string;
  title: string;
  message: string;
}

export const orderMessages: Record<OrderStatus, OrderMessage> = {
  confirmed: {
    subject: "Commande n°{orderNumber} confirmée",
    title: "Commande confirmée ✅",
    message:
      "Nous avons bien reçu votre commande et nous vous en remercions. Notre équipe va la traiter dans les plus brefs délais.",
  },
  preparing: {
    subject: "Commande n°{orderNumber} en cours de préparation",
    title: "Commande en préparation 📦",
    message:
      "Bonne nouvelle : votre commande est en cours de préparation. Nous vérifions et emballons soigneusement vos articles.",
  },
  shipped: {
    subject: "Commande n°{orderNumber} expédiée",
    title: "Commande expédiée 🚚",
    message:
      "Votre commande vient d'être expédiée. Elle est en route et vous sera livrée très bientôt.",
  },
  outForDelivery: {
    subject: "Commande n°{orderNumber} en cours de livraison",
    title: "Livraison en cours 🛵",
    message:
      "Votre commande est en cours de livraison. Merci de rester joignable : notre livreur vous contactera à son arrivée.",
  },
  delivered: {
    subject: "Commande n°{orderNumber} livrée",
    title: "Commande livrée 🎉",
    message:
      "Votre commande a bien été livrée. Nous espérons que vous êtes satisfait de vos achats. Merci de votre confiance !",
  },
  cancelled: {
    subject: "Commande n°{orderNumber} annulée",
    title: "Commande annulée ❌",
    message:
      "Votre commande a été annulée. Si vous n'êtes pas à l'origine de cette annulation ou si vous avez une question, n'hésitez pas à nous contacter. Nous restons à votre disposition.",
  },
};