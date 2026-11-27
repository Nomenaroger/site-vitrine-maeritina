import db from '../config/db.js'
import { createAdminToken } from '../middleware/adminAuth.js'
import { ensureAdminAccountTableAndSeed, hashPassword, verifyPassword } from '../utils/adminAccountService.js'

const clean = value => typeof value === 'string' ? value.trim() : value

export async function loginAdmin(req, res, next) {
  try {
    const username = clean(req.body?.username)
    const password = req.body?.password
    if (!username || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Veuillez renseigner votre identifiant et votre mot de passe.' })
    }

    await ensureAdminAccountTableAndSeed()

    const [rows] = await db.query(
      'SELECT id, username, password_hash FROM adminAcount WHERE username = ? LIMIT 1',
      [username]
    )

    const account = rows[0]
    if (!account || !verifyPassword(password, account.password_hash)) {
      return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' })
    }

    return res.json({
      token: createAdminToken({ id: account.id, username: account.username }),
      user: { id: account.id, username: account.username, role: 'admin' },
    })
  } catch (error) {
    if (error.message?.includes('ADMIN_TOKEN_SECRET')) {
      return res.status(500).json({ message: error.message })
    }
    next(error)
  }
}

export async function getAdminAccount(req, res, next) {
  try {
    await ensureAdminAccountTableAndSeed()
    const adminId = req.admin?.id
    const [rows] = adminId
      ? await db.query('SELECT id, username, created_at, updated_at FROM adminAcount WHERE id = ? LIMIT 1', [adminId])
      : await db.query('SELECT id, username, created_at, updated_at FROM adminAcount ORDER BY id ASC LIMIT 1')

    if (!rows.length) {
      return res.status(404).json({ message: 'Compte administrateur introuvable.' })
    }

    res.json({ data: rows[0] })
  } catch (error) {
    next(error)
  }
}

export async function updateAdminPassword(req, res, next) {
  try {
    const currentPassword = req.body?.currentPassword
    const newPassword = req.body?.newPassword
    const confirmPassword = req.body?.confirmPassword

    if (typeof currentPassword !== 'string' || !currentPassword) {
      return res.status(400).json({ message: 'Veuillez saisir votre mot de passe actuel.' })
    }
    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'La confirmation ne correspond pas au nouveau mot de passe.' })
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit être différent de l’ancien.' })
    }

    await ensureAdminAccountTableAndSeed()

    const adminId = req.admin?.id
    const [rows] = adminId
      ? await db.query('SELECT id, username, password_hash FROM adminAcount WHERE id = ? LIMIT 1', [adminId])
      : await db.query('SELECT id, username, password_hash FROM adminAcount ORDER BY id ASC LIMIT 1')

    const account = rows[0]
    if (!account) {
      return res.status(404).json({ message: 'Compte administrateur introuvable.' })
    }

    if (!verifyPassword(currentPassword, account.password_hash)) {
      return res.status(401).json({ message: 'Le mot de passe actuel est incorrect.' })
    }

    const nextHash = hashPassword(newPassword)
    await db.query(
      'UPDATE adminAcount SET password_hash = ? WHERE id = ?',
      [nextHash, account.id]
    )

    res.json({ message: 'Mot de passe mis à jour avec succès dans la base de données. Veuillez vous reconnecter.' })
  } catch (error) {
    next(error)
  }
}

export async function getDashboard(req, res, next) {
  try {
    const [[products]] = await db.query('SELECT COUNT(*) AS total FROM produits WHERE actif = 1')
    const [[categories]] = await db.query('SELECT COUNT(*) AS total FROM categories WHERE actif = 1')
    res.json({ data: { totalProduits: products.total, totalCategories: categories.total } })
  } catch (error) { next(error) }
}

export async function getAdminProducts(req, res, next) {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.categorie_id, c.nom AS categorie_nom, p.nom, p.description,
              p.reference_oem, p.prix, p.disponibilite, p.image_url
       FROM produits p INNER JOIN categories c ON c.id = p.categorie_id
       WHERE p.actif = 1 ORDER BY p.updated_at DESC, p.id DESC`
    )
    res.json({ data: rows })
  } catch (error) { next(error) }
}

function validateProduct(body) {
  const nom = clean(body?.nom)
  const categorieId = Number(body?.categorie_id)
  const prix = body?.prix === '' || body?.prix === null || body?.prix === undefined ? null : Number(body.prix)
  const disponibilite = body?.disponibilite || 'sur_commande'
  if (!nom || nom.length > 180) return { error: 'Le nom du produit est obligatoire (180 caractères maximum).' }
  if (!Number.isInteger(categorieId) || categorieId <= 0) return { error: 'Veuillez sélectionner une catégorie valide.' }
  if (prix !== null && (!Number.isFinite(prix) || prix < 0 || prix > 9999999999)) return { error: 'Le prix doit être un nombre positif valide.' }
  if (!['disponible', 'sur_commande', 'indisponible'].includes(disponibilite)) return { error: 'Disponibilité invalide.' }
  const imageUrl = clean(body?.image_url || '') || null
  if (imageUrl && imageUrl.length > 500) return { error: 'L’adresse de l’image est trop longue.' }
  return { value: {
    categorie_id: categorieId, nom, description: clean(body?.description || '') || null,
    reference_oem: clean(body?.reference_oem || '') || null, prix,
    disponibilite, image_url: imageUrl,
  }}
}

export async function createProduct(req, res, next) {
  try {
    const validated = validateProduct(req.body)
    if (validated.error) return res.status(400).json({ message: validated.error })
    const [category] = await db.query('SELECT id FROM categories WHERE id = ? AND actif = 1', [validated.value.categorie_id])
    if (!category.length) return res.status(400).json({ message: 'Catégorie introuvable.' })
    const p = validated.value
    if (req.file) p.image_url = req.file.path
    const [result] = await db.query(
      `INSERT INTO produits (categorie_id, nom, description, reference_oem, prix, disponibilite, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.categorie_id, p.nom, p.description, p.reference_oem, p.prix, p.disponibilite, p.image_url]
    )
    res.status(201).json({ message: 'Produit ajouté avec succès.', data: { id: result.insertId } })
  } catch (error) { next(error) }
}

export async function updateProduct(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Identifiant invalide.' })
    const validated = validateProduct(req.body)
    if (validated.error) return res.status(400).json({ message: validated.error })
    const p = validated.value
    if (req.file) p.image_url = req.file.path
    const [category] = await db.query('SELECT id FROM categories WHERE id = ? AND actif = 1', [p.categorie_id])
    if (!category.length) return res.status(400).json({ message: 'Catégorie introuvable.' })
    const [result] = await db.query(
      `UPDATE produits SET categorie_id=?, nom=?, description=?, reference_oem=?, prix=?, disponibilite=?, image_url=?
       WHERE id=? AND actif=1`,
      [p.categorie_id, p.nom, p.description, p.reference_oem, p.prix, p.disponibilite, p.image_url, id]
    )
    if (!result.affectedRows) return res.status(404).json({ message: 'Produit introuvable.' })
    res.json({ message: 'Produit modifié avec succès.' })
  } catch (error) { next(error) }
}

export async function deleteProduct(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Identifiant invalide.' })
    const [result] = await db.query('UPDATE produits SET actif = 0 WHERE id = ? AND actif = 1', [id])
    if (!result.affectedRows) return res.status(404).json({ message: 'Produit introuvable.' })
    res.json({ message: 'Produit supprimé du catalogue.' })
  } catch (error) { next(error) }
}
