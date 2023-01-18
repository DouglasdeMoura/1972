import { Router } from 'express'

import * as controller from '../controllers/customer-controller.js'
import * as authService from '../services/auth-service.js'

const router = Router()

router.post('/', controller.post)
router.post('/authenticate', controller.authenticate)
router.post('/refresh-token', authService.authorize, controller.refreshToken)

export default router
