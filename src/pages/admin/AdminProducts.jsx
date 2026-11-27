import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, X, Search, Package } from 'lucide-react'
import { adminRequest, getAdminToken } from '../../config/adminApi'
import { apiRequest, resolveProductImage } from '../../config/api'

const emptyForm = { categorie_id: '', nom: '', description: '', reference_oem: '', prix: '', disponibilite: 'sur_commande', image_url: '' }

function ProductModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(product ? { ...emptyForm, ...product, categorie_id: String(product.categorie_id), prix: product.prix ?? '' } : emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.image_url ? resolveProductImage(product.image_url) : '')
  useEffect(() => {
    if (!imageFile) return
    const previewUrl = URL.createObjectURL(imageFile)
    setImagePreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [imageFile])
  const change = e => setForm(current => ({ ...current, [e.target.name]: e.target.value }))
  async function submit(e) {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      const body = new FormData()
      Object.entries({ ...form, categorie_id: Number(form.categorie_id), prix: form.prix === '' ? '' : Number(form.prix) }).forEach(([key, value]) => body.append(key, value ?? ''))
      if (imageFile) body.append('image', imageFile)
      await adminRequest(product ? `/products/${product.id}` : '/products', { method: product ? 'PUT' : 'POST', body })
      onSaved()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  return <div className="admin-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <form className="admin-modal" onSubmit={submit}>
      <div className="admin-modal-heading"><div><span className="admin-topbar-label">CATALOGUE MAERITINA</span><h2>{product ? 'Modifier le produit' : 'Ajouter un produit'}</h2></div><button type="button" className="admin-icon-button" onClick={onClose} aria-label="Fermer"><X/></button></div>
      <div className="admin-form-grid">
        <label className="full">Nom du produit *<input name="nom" value={form.nom} onChange={change} maxLength="180" required/></label>
        <label>Catégorie *<select name="categorie_id" value={form.categorie_id} onChange={change} required><option value="">Sélectionner</option>{categories.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}</select></label>
        <label>Référence OEM<input name="reference_oem" value={form.reference_oem || ''} onChange={change}/></label>
        <label>Prix (Ar)<input type="number" min="0" step="0.01" name="prix" value={form.prix} onChange={change} placeholder="Laisser vide si prix sur demande"/></label>
        <label>Disponibilité<select name="disponibilite" value={form.disponibilite} onChange={change}><option value="disponible">Disponible</option><option value="sur_commande">Sur commande</option><option value="indisponible">Indisponible</option></select></label>
        <label className="full">Image du produit<input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>setImageFile(e.target.files?.[0] || null)}/><small>Formats acceptés : JPG, PNG, WEBP ou GIF (5 Mo maximum).</small></label>
        {imagePreview && <div className="admin-product-image-preview full"><img src={imagePreview} alt="Aperçu du produit"/><span>{imageFile ? imageFile.name : 'Image actuelle'}</span></div>}
        <label className="full">Description<textarea name="description" value={form.description || ''} onChange={change} rows="4"/></label>
      </div>
      {error && <div className="admin-alert error">{error}</div>}
      <div className="admin-modal-actions"><button type="button" className="admin-secondary-button" onClick={onClose}>Annuler</button><button className="admin-primary-button" disabled={saving}>{saving ? 'Enregistrement...' : product ? 'Enregistrer les modifications' : 'Ajouter le produit'}</button></div>
    </form>
  </div>
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  async function load() {
    setLoading(true); setError('')
    try {
      const [p, c] = await Promise.all([adminRequest('/products'), apiRequest('/categories')])
      setProducts(p.data || []); setCategories(c.data || [])
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  if (!getAdminToken()) return <Navigate to="/admin/login" replace/>
  const filtered = products.filter(p => `${p.nom} ${p.reference_oem || ''} ${p.categorie_nom || ''}`.toLowerCase().includes(query.toLowerCase()))
  async function remove(product) {
    if (!window.confirm(`Supprimer « ${product.nom} » du catalogue ?`)) return
    try { await adminRequest(`/products/${product.id}`, { method: 'DELETE' }); setNotice('Produit supprimé.'); load() }
    catch (err) { setError(err.message) }
  }
  return <section>
    <div className="admin-page-heading"><div><span className="admin-topbar-label">CATALOGUE</span><h1>Gestion des produits</h1><p>Ajoutez, modifiez et gérez les prix des pièces automobiles.</p></div><button className="admin-primary-button" onClick={()=>setModal('new')}><Plus size={18}/> Ajouter un produit</button></div>
    {notice && <div className="admin-alert success">{notice}<button onClick={()=>setNotice('')}><X size={15}/></button></div>}
    {error && <div className="admin-alert error">{error}</div>}
    <div className="admin-table-toolbar"><label><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un produit, une référence..."/></label><span>{filtered.length} produit(s)</span></div>
    <div className="admin-table-wrap"><table className="admin-products-table"><thead><tr><th>Produit</th><th>Catégorie</th><th>Référence OEM</th><th>Prix</th><th>Disponibilité</th><th>Actions</th></tr></thead><tbody>
      {loading ? <tr><td colSpan="6" className="admin-table-empty">Chargement des produits...</td></tr>
      : filtered.length === 0 ? <tr><td colSpan="6" className="admin-table-empty"><Package size={25}/><span>Aucun produit trouvé.</span></td></tr>
      : filtered.map(p=><tr key={p.id}><td><strong>{p.nom}</strong></td><td>{p.categorie_nom}</td><td>{p.reference_oem || '—'}</td><td className="admin-price">{p.prix === null ? 'Sur demande' : `${Number(p.prix).toLocaleString('fr-FR')} Ar`}</td><td><span className={`admin-status ${p.disponibilite}`}>{p.disponibilite === 'disponible' ? 'Disponible' : p.disponibilite === 'indisponible' ? 'Indisponible' : 'Sur commande'}</span></td><td><div className="admin-row-actions"><button onClick={()=>setModal(p)} aria-label={`Modifier ${p.nom}`} title="Modifier"><Pencil size={16}/></button><button className="delete" onClick={()=>remove(p)} aria-label={`Supprimer ${p.nom}`} title="Supprimer"><Trash2 size={16}/></button></div></td></tr>)}
    </tbody></table></div>
    {modal && <ProductModal product={modal === 'new' ? null : modal} categories={categories} onClose={()=>setModal(null)} onSaved={()=>{setModal(null);setNotice('Enregistrement effectué avec succès.');load()}}/>}
  </section>
}
