import { Router } from 'express'
import controller from '../controllers/product-controller.js'
import * as authService from '../services/auth-service.js'

const router = Router()

router.get('/', controller.get)
router.get('/:slug', controller.getBySlug)
router.get('/admin/:id', controller.getById)
router.get('/tags/:tag', controller.getByTag)
router.post('/', authService.isAdmin, controller.post)
router.put('/:id', authService.isAdmin, controller.put)
router.delete('/', authService.isAdmin, controller.delete)

export default router
