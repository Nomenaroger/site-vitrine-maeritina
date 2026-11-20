import SectionTitle from '../components/SectionTitle'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            APERÇU
          </span>
          <h1>Nos univers de pièces</h1>
          <p>Quelques familles illustratives du catalogue automobile.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="CATÉGORIES EN VEDETTE" title="L’univers Maeritina" />
          <div className="projects-grid">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          <p className="catalogue-disclaimer">
            Visuels de démonstration : les références, produits et stocks réels restent à intégrer.
          </p>
        </div>
      </section>
    </>
  )
}
