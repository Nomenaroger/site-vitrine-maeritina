import db from '../config/db.js'

export async function getCategories(req, res, next) {
  try {
    const [rows] = await db.query(
      'SELECT id, nom, description FROM categories WHERE actif = 1 ORDER BY nom'
    )
    res.json({ data: rows })
  } catch (error) {
    next(error)
  }
}

export async function getProducts(req, res, next) {
  try {
    const { q = '', categorie = '', marque = '' } = req.query
    const where = ['p.actif = 1']
    const values = []

    if (q.trim()) {
      where.push('(p.nom LIKE ? OR p.description LIKE ? OR p.reference_oem LIKE ?)')
      const term = `%${q.trim()}%`
      values.push(term, term, term)
    }

    if (categorie) {
      where.push('p.categorie_id = ?')
      values.push(Number(categorie))
    }

    if (marque.trim()) {
      where.push(`EXISTS (
        SELECT 1
        FROM marques_vehicules mv
        WHERE mv.produit_id = p.id
          AND (mv.marque LIKE ? OR mv.modele LIKE ?)
      )`)
      const term = `%${marque.trim()}%`
      values.push(term, term)
    }

    const [rows] = await db.query(
      `SELECT
        p.id,
        p.categorie_id,
        c.nom AS categorie_nom,
        p.nom,
        p.description,
        p.reference_oem,
        p.prix,
        p.disponibilite,
        p.image_url
      FROM produits p
      INNER JOIN categories c ON c.id = p.categorie_id
      WHERE ${where.join(' AND ')}
      ORDER BY p.created_at DESC`,
      values
    )

    res.json({ data: rows })
  } catch (error) {
    next(error)
  }
}

export async function getProductById(req, res, next) {
  try {
    const productId = Number(req.params.id)

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: 'Identifiant de produit invalide.' })
    }

    const [rows] = await db.query(
      `SELECT
        p.id,
        p.categorie_id,
        c.nom AS categorie_nom,
        p.nom,
        p.description,
        p.reference_oem,
        p.prix,
        p.disponibilite,
        p.image_url
      FROM produits p
      INNER JOIN categories c ON c.id = p.categorie_id
      WHERE p.id = ? AND p.actif = 1
      LIMIT 1`,
      [productId]
    )

    if (!rows.length) {
      return res.status(404).json({ message: 'Produit introuvable.' })
    }

    const [vehicles] = await db.query(
      `SELECT marque, modele, annee_debut, annee_fin
       FROM marques_vehicules
       WHERE produit_id = ?
       ORDER BY marque, modele`,
      [productId]
    )

    res.json({ data: { ...rows[0], compatibilites: vehicles } })
  } catch (error) {
    next(error)
  }
}
