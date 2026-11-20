import { useState } from 'react'
import { Send } from 'lucide-react'
import { buildWhatsAppUrl } from '../config/urlConfig'
import { apiRequest } from '../config/api'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', vehicle: '', reference: '', message: '' })
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  async function submit(event) {
    event.preventDefault()
    setSending(true); setError(''); setNotice('')
    try {
      await apiRequest('/quotes', { method: 'POST', body: JSON.stringify({
        nom_client: form.name, telephone: form.phone, vehicule: form.vehicle,
        reference_recherchee: form.reference, message: form.message,
      }) })
      const message = ['Bonjour Maeritina, je souhaite demander un devis.', `Nom : ${form.name}`, `Téléphone : ${form.phone}`, `Véhicule : ${form.vehicle || 'Non précisé'}`, `Référence / pièce : ${form.reference || 'Non précisée'}`, `Demande : ${form.message}`].join('\n')
      window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
      setNotice('Votre demande a été enregistrée. WhatsApp va également s’ouvrir pour vous permettre de contacter le magasin.')
      setForm({ name: '', phone: '', vehicle: '', reference: '', message: '' })
    } catch (err) {
      setError(`${err.message} Votre demande n’a pas été enregistrée. Vérifiez que le backend et MySQL sont démarrés.`)
    } finally { setSending(false) }
  }

  return <form className="contact-form" onSubmit={submit}>
    <div className="form-row"><label>Nom complet *<input required name="name" value={form.name} onChange={update} placeholder="Votre nom"/></label><label>Téléphone *<input required name="phone" value={form.phone} onChange={update} placeholder="+261 ..."/></label></div>
    <label>Véhicule concerné<input name="vehicle" value={form.vehicle} onChange={update} placeholder="Marque, modèle, année"/></label>
    <label>Référence ou pièce recherchée<input name="reference" value={form.reference} onChange={update} placeholder="Référence OEM ou nom de la pièce"/></label>
    <label>Votre demande *<textarea required name="message" rows="4" value={form.message} onChange={update} placeholder="Décrivez votre besoin..."/></label>
    <button className="button button-orange" type="submit" disabled={sending}><Send size={17}/>{sending ? 'Enregistrement...' : 'Envoyer ma demande'}</button>
    {notice && <p className="form-notice" role="status">{notice}</p>}{error && <p className="form-error" role="alert">{error}</p>}
    <small>Votre demande est enregistrée dans la base de données avant l’ouverture de WhatsApp.</small>
  </form>
}
