import crypto from 'node:crypto'

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex')
}

export function createAdminToken(adminUser = {}) {
  const secret = process.env.ADMIN_TOKEN_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_TOKEN_SECRET doit contenir au moins 32 caractères.')
  }
  const payload = Buffer.from(JSON.stringify({
    id: adminUser.id || 1,
    username: adminUser.username || 'admin',
    role: 'admin',
    exp: Date.now() + 8 * 60 * 60 * 1000,
  })).toString('base64url')
  return `${payload}.${sign(payload, secret)}`
}

export function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  const secret = process.env.ADMIN_TOKEN_SECRET
  if (!token || !secret) return res.status(401).json({ message: 'Authentification administrateur requise.' })

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return res.status(401).json({ message: 'Session administrateur invalide.' })

  const expected = sign(payload, secret)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ message: 'Session administrateur invalide.' })
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (data.role !== 'admin' || !data.exp || data.exp < Date.now()) {
      return res.status(401).json({ message: 'Session expirée. Veuillez vous reconnecter.' })
    }
    req.admin = data
    next()
  } catch {
    return res.status(401).json({ message: 'Session administrateur invalide.' })
  }
}
