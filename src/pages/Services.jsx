import { useEffect, useMemo, useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import { apiRequest } from '../config/api'

export default function Services() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([apiRequest('/products'), apiRequest('/categories')])
      .then(([productData, categoryData]) => {
        if (!active) return
        setProducts(productData.data || [])
        setCategories(categoryData.data || [])
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const visible = useMemo(
    () =>
      products.filter((p) => {
        const text = `${p.nom} ${p.description || ''} ${p.reference_oem || ''}`.toLowerCase()
        return (
          text.includes(query.toLowerCase()) &&
          (category === 'all' || String(p.categorie_id) === category)
        )
      }),
    [products, query, category]
  )

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            CATALOGUE
          </span>
          <h1>Catalogue de pièces</h1>
          <p>
            Recherchez une pièce par son nom, sa référence OEM ou sa catégorie. Contactez-nous pour confirmer sa compatibilité et sa disponibilité.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="CATALOGUE CONNECTÉ"
            title="Nos pièces détachées"
            description="Les produits affichés proviennent de la base de données Maeritina."
          />
          <div className="catalogue-tools">
            <label className="search-box">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom, description ou référence OEM..."
              />
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>
          {loading && <p className="catalogue-disclaimer">Chargement du catalogue...</p>}
          {error && (
            <p className="catalogue-disclaimer" role="alert">
              Impossible de charger le catalogue : {error}. Vérifiez que le serveur Express et MySQL sont démarrés.
            </p>
          )}
          {!loading && !error && visible.length === 0 && (
            <div className="empty-state chamfer-card">
              <SectionTitle
                eyebrow="CATALOGUE"
                title="Aucun produit disponible"
                description="Aucun produit ne correspond à votre recherche pour le moment. Revenez plus tard ou contactez-nous pour une demande particulière."
                centered
              />
            </div>
          )}
          <div className="products-grid">
            {visible.map((p) => (
              <article className="product-card chamfer-card-sm" key={p.id}>
                <div className="product-card-image">
                  {p.image_url ? <img src={p.image_url} alt={p.nom} /> : <span>MAERITINA</span>}
                </div>
                <div className="product-card-content">
                  <span>{p.categorie_nom || 'Pièce automobile'}</span>
                  <h3>{p.nom}</h3>
                  <p>{p.description || 'Contactez-nous pour plus d’informations.'}</p>
                  {p.reference_oem && <small>Réf. OEM : {p.reference_oem}</small>}
                  <div className="product-card-bottom">
                    <strong>
                      {p.prix !== null && p.prix !== undefined
                        ? `${Number(p.prix).toLocaleString('fr-FR')} Ar`
                        : 'Prix sur demande'}
                    </strong>
                    <span
                      className={`stock-label ${
                        p.disponibilite === 'disponible' ? 'in-stock' : 'out-stock'
                      }`}
                    >
                      {p.disponibilite === 'disponible'
                        ? 'Disponible'
                        : p.disponibilite === 'indisponible'
                        ? 'Indisponible'
                        : 'Sur commande'}
                    </span>
                  </div>
                  <Link className="product-detail-link" to={`/produit/${p.id}`}>
                    Voir la fiche produit <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
