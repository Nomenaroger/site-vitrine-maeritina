export function notFound(req, res) {
  res.status(404).json({
    message: `Route introuvable : ${req.method} ${req.originalUrl}`,
  })
}

export function errorHandler(error, req, res, next) {
  console.error('Erreur API :', error.code || error.message)

  if (error.message === 'Origine non autorisée par CORS.') {
    return res.status(403).json({ message: error.message })
  }

  res.status(500).json({
    message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
  })
}
