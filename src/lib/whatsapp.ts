const WHATSAPP_NUMBER = "2290148108013";

export function getWhatsAppUrl(productName?: string): string {
  const message = productName
    ? `Bonjour MASFLY, je souhaite commander ce produit : ${productName}`
    : "Bonjour MASFLY, je souhaite passer une commande.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
