import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buildWhatsAppUrl } from '../config/urlConfig'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-top">
          <div className="hero-title-col">
            <span className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              MAERITINA QUINCAILLERIE
            </span>
            <h1>
              La bonne pièce pour <em>votre</em> véhicule.
            </h1>
          </div>
          <div className="hero-intro-col">
            <p>
              Découvrez notre catalogue de pièces détachées automobiles et contactez-nous pour vérifier une référence, une compatibilité ou une disponibilité.
            </p>
            <div className="hero-trust">
              <ShieldCheck size={17} />
              <span>Un accompagnement pour les particuliers et les professionnels</span>
            </div>
          </div>
        </div>

        <div className="hero-media-grid">
          <div className="hero-card-left chamfer-card">
            <img
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=90"
              alt="Pièces mécaniques automobiles"
            />
          </div>

          <div className="hero-card-right-col">
            <div className="hero-card-right chamfer-card">
              <img
                src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=90"
                alt="Pièces et équipements automobiles"
              />
              <div className="hero-caption">
                <span className="caption-dot" /> Pièces &amp; équipements automobiles
              </div>
            </div>

            <div className="hero-actions">
              <a
                className="button button-orange"
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} /> Demander un devis
              </a>
              <Link className="button button-outline" to="/services">
                Explorer le catalogue <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
