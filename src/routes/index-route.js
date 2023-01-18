import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.status(200).send({
    title: 'Node Store API',
    version: '0.0.2',
  })
})

export default router
