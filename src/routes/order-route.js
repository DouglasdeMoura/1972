import { Router } from 'express'

import * as controller from '../controllers/order-controller.js'
import * as authService from '../services/auth-service.js'

const router = Router()

router.get('/', authService.authorize, controller.get)
router.post('/', authService.authorize, controller.post)

export default router
