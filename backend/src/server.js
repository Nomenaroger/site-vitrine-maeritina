import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import db, { checkDatabaseConnection } from './config/db.js'
import catalogRoutes from './routes/catalogRoutes.js'
import quoteRoutes from './routes/quoteRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import { ensureAdminAccountTableAndSeed } from './utils/adminAccountService.js'

dotenv.config()

const app = express()
const backendDirectory = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT || 5000)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean)

app.use(helmet({
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
}))

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Origine non autorisée par CORS.'))
  },
}))

app.use(express.json({ limit: '1mb' }))

app.use('/uploads', express.static(
  path.join(backendDirectory, '../uploads'),
  {
    maxAge: '7d'
  }
))
app.use(morgan('dev'))

app.get('/api/health', async (req, res) => {
  try {
    await checkDatabaseConnection()
    res.status(200).json({
      status: 'ok',
      app: 'Maeritina API',
      database: 'connected',
    })
  } catch (error) {
    console.error('Échec du contrôle MySQL :', error.code || error.message)
    res.status(503).json({
      status: 'error',
      app: 'Maeritina API',
      database: 'disconnected',
      message: 'La base de données est momentanément inaccessible.',
    })
  }
})

app.use('/api', catalogRoutes)
app.use('/api', quoteRoutes)
app.use('/api/admin', adminRoutes)
app.use(notFound)
app.use(errorHandler)

async function startServer() {
  try {
    await checkDatabaseConnection()
    await ensureAdminAccountTableAndSeed()
    console.log('Connexion MySQL établie avec succès.')
    app.listen(port, () => {
      console.log(`Maeritina API démarrée : http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Impossible de se connecter à MySQL.')
    console.error(`Code : ${error.code || 'INCONNU'}`)
    console.error('Vérifiez le fichier backend/.env et assurez-vous que MySQL est démarré.')
    process.exit(1)
  }
}

startServer()

process.on('SIGINT', async () => {
  await db.end()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await db.end()
  process.exit(0)
})
