import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            CONTACT &amp; DEVIS
          </span>
          <h1>Parlons de votre besoin</h1>
          <p>Envoyez-nous les informations de votre véhicule et la pièce recherchée.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div>
            <SectionTitle
              eyebrow="DEMANDE DE DEVIS"
              title="Comment pouvons-nous vous aider ?"
              description="Remplissez le formulaire. Votre demande sera préparée dans WhatsApp pour être envoyée directement."
            />
            <div className="contact-details">
              <div className="contact-detail-card chamfer-card-sm">
                <span className="service-icon">
                  <MapPin size={19} />
                </span>
                <span>
                  <strong>Adresse</strong>
                  <small>À compléter par l’entreprise</small>
                </span>
              </div>
              <div className="contact-detail-card chamfer-card-sm">
                <span className="service-icon">
                  <Phone size={19} />
                </span>
                <span>
                  <strong>Téléphone</strong>
                  <small>À compléter par l’entreprise</small>
                </span>
              </div>
              <div className="contact-detail-card chamfer-card-sm">
                <span className="service-icon">
                  <Mail size={19} />
                </span>
                <span>
                  <strong>E-mail</strong>
                  <small>À compléter par l’entreprise</small>
                </span>
              </div>
              <div className="contact-detail-card chamfer-card-sm">
                <span className="service-icon">
                  <Clock size={19} />
                </span>
                <span>
                  <strong>Horaires</strong>
                  <small>À confirmer</small>
                </span>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
