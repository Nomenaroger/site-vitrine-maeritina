import crypto from 'node:crypto'
import db from '../config/db.js'

const KEY_LENGTH = 64

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex')
  return `${salt}:${derivedKey}`
}

export function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || typeof storedHash !== 'string') return false
  const parts = storedHash.split(':')
  if (parts.length !== 2) return false
  const [salt, keyHex] = parts
  const keyBuffer = Buffer.from(keyHex, 'hex')
  const derivedBuffer = crypto.scryptSync(password, salt, keyBuffer.length)
  if (keyBuffer.length !== derivedBuffer.length) return false
  return crypto.timingSafeEqual(keyBuffer, derivedBuffer)
}

export async function ensureAdminAccountTableAndSeed() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS adminAcount (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_admin_account_username (username)
    ) ENGINE=InnoDB
  `)

  const [rows] = await db.query('SELECT id, username FROM adminAcount LIMIT 1')
  if (rows.length === 0) {
    const defaultUsername = (process.env.ADMIN_USERNAME || 'admin').trim()
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123456'
    const passwordHash = hashPassword(defaultPassword)
    await db.query(
      'INSERT INTO adminAcount (username, password_hash) VALUES (?, ?)',
      [defaultUsername, passwordHash]
    )
  }
}
