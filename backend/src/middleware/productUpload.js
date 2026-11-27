import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../')
const uploadDirectory = path.join(backendRoot, 'uploads', 'products')
const MAX_FILE_SIZE = 5 * 1024 * 1024
const allowedTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
])

function parseDisposition(value = '') {
  const name = value.match(/(?:^|;)\s*name="([^"]*)"/i)?.[1]
  const filename = value.match(/(?:^|;)\s*filename="([^"]*)"/i)?.[1]
  return { name, filename }
}

export async function productUpload(req, res, next) {
  if (!req.headers['content-type']?.toLowerCase().startsWith('multipart/form-data')) {
    req.body ||= {}
    return next()
  }

  try {
    const boundary = req.headers['content-type'].match(/boundary=(?:"([^"]+)"|([^;]+))/i)
    const boundaryValue = boundary?.[1] || boundary?.[2]?.trim()
    if (!boundaryValue) return res.status(400).json({ message: 'Formulaire image invalide.' })

    const chunks = []
    let total = 0
    for await (const chunk of req) {
      total += chunk.length
      if (total > MAX_FILE_SIZE + 1024 * 1024) {
        return res.status(413).json({ message: 'Le formulaire est trop volumineux (image limitée à 5 Mo).' })
      }
      chunks.push(chunk)
    }

    const raw = Buffer.concat(chunks)
    const delimiter = Buffer.from(`--${boundaryValue}`)
    const separator = Buffer.from('\r\n\r\n')
    const body = {}
    let uploadedFile = null
    let cursor = 0

    while (true) {
      const boundaryStart = raw.indexOf(delimiter, cursor)
      if (boundaryStart < 0) break
      let partStart = boundaryStart + delimiter.length
      if (raw.subarray(partStart, partStart + 2).toString() === '--') break
      if (raw.subarray(partStart, partStart + 2).toString() === '\r\n') partStart += 2

      const headerEnd = raw.indexOf(separator, partStart)
      if (headerEnd < 0) break
      const headers = raw.subarray(partStart, headerEnd).toString('utf8')
      const contentStart = headerEnd + separator.length
      const nextBoundary = raw.indexOf(Buffer.concat([Buffer.from('\r\n'), delimiter]), contentStart)
      if (nextBoundary < 0) break
      const content = raw.subarray(contentStart, nextBoundary)
      const disposition = headers.match(/content-disposition:\s*form-data;([^\r\n]+)/i)?.[1] || ''
      const { name, filename } = parseDisposition(disposition)
      const mimeType = headers.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim().toLowerCase()

      if (name && filename !== undefined) {
        if (filename && content.length) {
          const extension = allowedTypes.get(mimeType)
          if (!extension) return res.status(400).json({ message: 'Format d’image non accepté. Utilisez JPG, PNG, WEBP ou GIF.' })
          if (content.length > MAX_FILE_SIZE) return res.status(413).json({ message: 'L’image ne doit pas dépasser 5 Mo.' })
          await fs.mkdir(uploadDirectory, { recursive: true })
          const fileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`
          await fs.writeFile(path.join(uploadDirectory, fileName), content, { flag: 'wx' })
          uploadedFile = { filename: fileName, path: `/uploads/products/${fileName}`, mimetype: mimeType }
        }
      } else if (name) {
        body[name] = content.toString('utf8')
      }
      cursor = nextBoundary + 2
    }

    req.body = body
    req.file = uploadedFile
    next()
  } catch (error) {
    next(error)
  }
}
