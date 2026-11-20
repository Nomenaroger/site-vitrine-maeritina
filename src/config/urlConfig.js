export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '+261342418235').replace(/\D/g, '')
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export function buildWhatsAppUrl(message = 'Bonjour Maeritina, je souhaite obtenir des informations sur vos pièces automobiles.') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
