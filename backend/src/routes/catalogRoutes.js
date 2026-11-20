import { Router } from 'express'
import { getCategories, getProducts, getProductById } from '../controllers/catalogController.js'
const router = Router()
router.get('/categories', getCategories)
router.get('/products', getProducts)
router.get('/products/:id', getProductById)
export default router
