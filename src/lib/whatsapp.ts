const WHATSAPP_NUMBER = "2290148108013";

type CartItemLite = {
  name: string;
  price: number;
  quantity: number;
};

export function getWhatsAppUrl(productName?: string): string {
  const message = productName
    ? `Bonjour MASFLY, je souhaite commander ce produit : ${productName}`
    : "Bonjour MASFLY, je souhaite passer une commande.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCartUrl(items: CartItemLite[]): string {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} — ${item.quantity} x ${item.price.toLocaleString(
        "fr-FR",
      )} FCFA`,
  );
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const message = [
    "Bonjour MASFLY, je souhaite commander ces produits :",
    "",
    ...lines,
    "",
    `Total estimé : ${total.toLocaleString("fr-FR")} FCFA`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
