import { ArrowRight, CheckCircle2, Search, Truck, BadgeCheck, ShieldCheck, Wrench, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import { services } from '../data/services'
import { projects } from '../data/projects'

export default function Home() {
  return (
    <>
      <Hero />

      {/* Section À Propos — Bento Grid inspiré de la maquette */}
      <section className="section about-bento-section">
        <div className="container">
          <SectionTitle
            eyebrow="À PROPOS"
            title="Un partenaire pour vos besoins automobiles"
            description="Maeritina Quincaillerie est spécialisée dans la vente de pièces détachées automobiles. Notre objectif est de faciliter la recherche de pièces et la prise de contact pour les particuliers comme pour les professionnels."
            centered
          />

          <div className="bento-grid">
            {/* Grande carte gauche */}
            <article className="bento-card bento-card-main chamfer-card">
              <div className="bento-brand-badge">
                <span className="bento-brand-icon">
                  <Wrench size={20} />
                </span>
                <strong>MAERITINA</strong>
              </div>

              <div className="bento-main-copy">
                <h3>Catalogue Automobile</h3>
                <p>
                  Une sélection structurée de pièces détachées pour l’entretien courant et la réparation de votre véhicule.
                </p>
              </div>

              <ul className="check-list">
                <li>
                  <CheckCircle2 size={17} /> Recherche par référence ou type de pièce
                </li>
                <li>
                  <CheckCircle2 size={17} /> Informations de compatibilité à confirmer
                </li>
                <li>
                  <CheckCircle2 size={17} /> Demande de devis et contact direct
                </li>
              </ul>
            </article>

            {/* Colonne centrale */}
            <div className="bento-col">
              <article className="bento-card chamfer-card">
                <span className="bento-icon-pill">
                  <Search size={18} />
                </span>
                <h3>Référence &amp; OEM</h3>
                <p>
                  Identifiez rapidement vos pièces par nom, catégorie ou référence constructeur.
                </p>
              </article>

              <article className="bento-card chamfer-card">
                <span className="bento-icon-pill">
                  <ShieldCheck size={18} />
                </span>
                <div className="bento-stat-value">100%</div>
                <p>Accompagnement particuliers &amp; professionnels</p>
              </article>
            </div>

            {/* Colonne droite */}
            <div className="bento-col">
              <article className="bento-card chamfer-card">
                <span className="bento-icon-pill">
                  <BadgeCheck size={18} />
                </span>
                <div className="bento-stat-value">6 Familles</div>
                <p>Freinage, moteur, filtration, suspension, électricité et transmission</p>
              </article>

              <article className="bento-card chamfer-card">
                <span className="bento-icon-pill">
                  <Headphones size={18} />
                </span>
                <h3>Conseil &amp; Proximité</h3>
                <p>
                  Notre équipe vérifie la compatibilité et la disponibilité directement avec vous.
                </p>
              </article>
            </div>
          </div>

          <div className="center-action">
            <Link className="button button-outline" to="/a-propos">
              En savoir plus <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Nos Domaines / Services */}
      <section className="section categories-section">
        <div className="container">
          <SectionTitle
            eyebrow="NOS DOMAINES"
            title="Trouvez les pièces qu’il vous faut"
            description="Parcourez les grandes familles de pièces automobiles. Pour toute compatibilité, demandez une confirmation à notre équipe."
            action={
              <Link className="button button-outline" to="/services">
                Voir toutes les catégories <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="services-grid">
            {services.slice(0, 6).map((item) => (
              <ServiceCard key={item.id} service={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Sélection / Univers */}
      <section className="section featured-section">
        <div className="container">
          <SectionTitle
            eyebrow="SÉLECTION"
            title="Explorez notre univers automobile"
            description="Quelques visuels illustrant les familles de produits du catalogue."
            centered
          />
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="center-action">
            <Link className="button button-outline" to="/realisations">
              Voir nos univers de pièces <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Engagements / Étapes numérotées 01 - 03 */}
      <section className="section steps-section">
        <div className="container">
          <SectionTitle
            eyebrow="NOS ENGAGEMENTS"
            title="Un service simple et efficace"
            description="De la recherche de référence jusqu’à la confirmation en magasin, nous simplifions vos démarches."
            action={
              <Link className="button button-orange" to="/contact">
                Demander un devis <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="steps-grid">
            <article className="step-card chamfer-card">
              <div className="step-header">
                <span className="step-icon">
                  <Search size={19} />
                </span>
                <span className="step-number">01</span>
              </div>
              <h3>Recherche facilitée</h3>
              <p>Par type de pièce ou référence.</p>
            </article>

            <article className="step-card chamfer-card">
              <div className="step-header">
                <span className="step-icon">
                  <BadgeCheck size={19} />
                </span>
                <span className="step-number">02</span>
              </div>
              <h3>Informations claires</h3>
              <p>Caractéristiques et compatibilité à vérifier.</p>
            </article>

            <article className="step-card chamfer-card">
              <div className="step-header">
                <span className="step-icon">
                  <Truck size={19} />
                </span>
                <span className="step-number">03</span>
              </div>
              <h3>Disponibilité sur demande</h3>
              <p>Contactez le magasin pour confirmation.</p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card chamfer-card">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                BESOIN D’UNE PIÈCE ?
              </span>
              <h2>Parlons de votre recherche.</h2>
              <p>Transmettez-nous le modèle de votre véhicule ou la référence recherchée.</p>
            </div>
            <Link className="button button-orange" to="/contact">
              Demander un devis <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
