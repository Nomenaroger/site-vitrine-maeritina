import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { apiRequest, resolveProductImage } from '../config/api'
import { buildWhatsAppUrl } from '../config/urlConfig'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    apiRequest(`/products/${id}`)
      .then(result => { if (active) setProduct(result.data) })
      .catch(err => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <section className="section"><div className="container"><p>Chargement de la fiche produit...</p></div></section>
  if (error || !product) return <section className="section"><div className="container"><SectionTitle eyebrow="PRODUIT" title="Fiche produit indisponible" description={error || 'Ce produit est introuvable.'}/><Link className="button button-outline" to="/services"><ArrowLeft size={16}/> Retour au catalogue</Link></div></section>

  const availability = product.disponibilite === 'disponible'
    ? 'Disponible'
    : product.disponibilite === 'indisponible' ? 'Indisponible' : 'Sur commande'
  const message = `Bonjour Maeritina, je souhaite un devis pour : ${product.nom}${product.reference_oem ? ` (Réf. OEM : ${product.reference_oem})` : ''}.`

  return <section className="section product-detail-section"><div className="container">
    <Link className="text-link" to="/services"><ArrowLeft size={16}/> Retour au catalogue</Link>
    <div className="product-detail-grid">
      <div className="product-detail-image">{product.image_url ? <img src={resolveProductImage(product.image_url)} alt={product.nom}/> : <span>MAERITINA</span>}</div>
      <div className="product-detail-copy">
        <span className="eyebrow">{product.categorie_nom || 'PIÈCE AUTOMOBILE'}</span>
        <h1>{product.nom}</h1>
        <p>{product.description || 'Contactez notre équipe pour obtenir davantage d’informations sur ce produit.'}</p>
        {product.reference_oem && <p><strong>Référence OEM :</strong> {product.reference_oem}</p>}
        <p><strong>Disponibilité :</strong> {availability}</p>
        <p className="product-detail-price">{product.prix !== null && product.prix !== undefined ? `${Number(product.prix).toLocaleString('fr-FR')} Ar` : 'Prix sur demande'}</p>
        <h2>Compatibilité véhicules</h2>
        {product.compatibilites?.length
          ? <ul className="compatibility-list">{product.compatibilites.map((v, i) => <li key={`${v.marque}-${v.modele}-${i}`}>{v.marque} {v.modele}{v.annee_debut || v.annee_fin ? ` (${v.annee_debut || '...'} – ${v.annee_fin || '...'})` : ''}</li>)}</ul>
          : <p>Compatibilité à confirmer auprès de notre équipe.</p>}
        <a className="button button-orange" href={buildWhatsAppUrl(message)} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Demander un devis sur WhatsApp</a>
      </div>
    </div>
  </div></section>
}
