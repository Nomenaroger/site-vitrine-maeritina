import { Router } from 'express'
import {
  loginAdmin,
  getDashboard,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminAccount,
  updateAdminPassword,
} from '../controllers/adminController.js'
import { requireAdmin } from '../middleware/adminAuth.js'

const router = Router()
router.post('/login', loginAdmin)
router.use(requireAdmin)
router.get('/dashboard', getDashboard)
router.get('/account', getAdminAccount)
router.put('/account/password', updateAdminPassword)
router.get('/products', getAdminProducts)
router.post('/products', createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)
export default router
