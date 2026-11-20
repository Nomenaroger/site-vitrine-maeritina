import { ArrowRight, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-image chamfer-card-sm">
        <img src={project.image} alt={project.title} />
      </div>
      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-meta">
          <span>
            <Tag size={13} /> {project.category}
          </span>
        </div>
        <Link to="/services" className="text-link">
          Voir le catalogue <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  )
}
