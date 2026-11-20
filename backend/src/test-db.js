import dotenv from 'dotenv'
import { checkDatabaseConnection } from './config/db.js'
import db from './config/db.js'

dotenv.config()

try {
  await checkDatabaseConnection()
  console.log('OK : Node.js communique correctement avec MySQL.')
  console.log(`Base utilisée : ${process.env.DB_NAME || 'maeritina_db'}`)
  process.exitCode = 0
} catch (error) {
  console.error('ÉCHEC : connexion MySQL impossible.')
  console.error(`Code : ${error.code || 'INCONNU'}`)
  console.error('Vérifiez MySQL et les paramètres du fichier backend/.env.')
  process.exitCode = 1
} finally {
  await db.end()
}
