import SectionTitle from '../components/SectionTitle'
import { CheckCircle2, Target, Eye, Handshake } from 'lucide-react'

export default function About() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            QUI SOMMES-NOUS ?
          </span>
          <h1>À propos de Maeritina</h1>
          <p>Une quincaillerie spécialisée dans les pièces détachées automobiles.</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div className="about-photo chamfer-card">
            <img
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1100&q=85"
              alt="Pièces automobiles"
            />
            <div className="photo-label">
              MAERITINA <span>QUINCAILLERIE</span>
            </div>
          </div>
          <div className="about-copy">
            <SectionTitle
              eyebrow="NOTRE ENTREPRISE"
              title="La pièce adaptée commence par la bonne référence"
              description="Maeritina Quincaillerie a pour vocation de présenter un catalogue de pièces détachées automobiles, d’aider à identifier les besoins et de simplifier les demandes de devis. Les informations commerciales et historiques détaillées seront complétées par l’entreprise."
            />
            <ul className="check-list">
              <li>
                <CheckCircle2 size={18} /> Accueil des particuliers et professionnels
              </li>
              <li>
                <CheckCircle2 size={18} /> Recherche de pièces par référence ou catégorie
              </li>
              <li>
                <CheckCircle2 size={18} /> Contact direct pour les demandes de devis
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <SectionTitle
            eyebrow="NOS ENGAGEMENTS"
            title="Des échanges simples et transparents"
            centered
          />
          <div className="values-grid">
            <article className="chamfer-card">
              <span className="service-icon">
                <Target size={22} />
              </span>
              <h3>Notre mission</h3>
              <p>Faciliter la présentation et la recherche de pièces détachées automobiles.</p>
            </article>
            <article className="chamfer-card">
              <span className="service-icon">
                <Eye size={22} />
              </span>
              <h3>Notre vision</h3>
              <p>Proposer une vitrine claire et pratique pour informer et orienter les clients.</p>
            </article>
            <article className="chamfer-card">
              <span className="service-icon">
                <Handshake size={22} />
              </span>
              <h3>Nos valeurs</h3>
              <p>Écoute, clarté et accompagnement dans chaque demande.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
