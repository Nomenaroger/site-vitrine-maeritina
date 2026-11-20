import SectionTitle from '../components/SectionTitle'
import { Bell } from 'lucide-react'

export default function News() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            ACTUALITÉS
          </span>
          <h1>Actualités &amp; conseils</h1>
          <p>Retrouvez prochainement les informations et nouveautés de Maeritina Quincaillerie.</p>
        </div>
      </section>
      <section className="section">
        <div className="container empty-state chamfer-card">
          <span className="service-icon">
            <Bell size={24} />
          </span>
          <SectionTitle
            eyebrow="BIENTÔT DISPONIBLE"
            title="Nos actualités arrivent bientôt"
            description="Aucun article n’a encore été publié. Cette rubrique pourra accueillir les nouveautés, conseils d’entretien et informations du magasin."
            centered
          />
        </div>
      </section>
    </>
  )
}
