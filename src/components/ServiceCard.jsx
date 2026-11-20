import { Disc3, Cog, Filter, CarFront, Zap, Settings, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const iconMap = { Disc3, Cog, Filter, CarFront, Zap, Settings }

export default function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || Cog
  return (
    <Link className="service-card chamfer-card" to="/services">
      <div className="service-card-top">
        <span className="service-icon">
          <Icon size={21} />
        </span>
      </div>
      <div className="service-card-body">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <span className="service-more">
          Découvrir <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  )
}
