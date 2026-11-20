import db from '../config/db.js'

export async function createQuote(req, res, next) {
  try {
    const nomClient = typeof req.body.nom_client === 'string' ? req.body.nom_client.trim() : ''
    const telephone = typeof req.body.telephone === 'string' ? req.body.telephone.trim() : ''
    const vehicule = typeof req.body.vehicule === 'string' ? req.body.vehicule.trim() : ''
    const reference = typeof req.body.reference_recherchee === 'string'
      ? req.body.reference_recherchee.trim()
      : ''
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : ''

    if (!nomClient || !telephone || !message) {
      return res.status(400).json({
        message: 'Le nom, le téléphone et le message sont obligatoires.',
      })
    }

    if (
      nomClient.length > 150 ||
      telephone.length > 40 ||
      vehicule.length > 180 ||
      reference.length > 180 ||
      message.length > 3000
    ) {
      return res.status(400).json({
        message: 'Un ou plusieurs champs dépassent la longueur autorisée.',
      })
    }

    const [result] = await db.execute(
      `INSERT INTO demandes_devis
        (nom_client, telephone, vehicule, reference_recherchee, message, statut)
       VALUES (?, ?, ?, ?, ?, 'nouvelle')`,
      [nomClient, telephone, vehicule || null, reference || null, message],
    )

    res.status(201).json({
      message: 'Demande de devis enregistrée.',
      id: result.insertId,
    })
  } catch (error) {
    next(error)
  }
}
