import { describe, expect, it } from 'vitest'

import { request } from '../../.vitest/setup.js'

describe('customer-route', () => {
  describe('POST /products', () => {
    it('deve retornar 401 quando não houver token', async () => {
      const response = await request.post('/products')

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Token Inválido',
      })
    })

    it('deve retornar 401 quando o token enviado no body for inválido', async () => {
      const response = await request
        .post('/products')
        .send({ token: 'token_invalido' })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Token Inválido',
      })
    })

    it('deve retornar 401 quando o token enviado na URL for inválido', async () => {
      const response = await request.post('/products?token=token_invalido')

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Token Inválido',
      })
    })

    it('deve retornar 401 quando o token enviado nos headers "x-access-token" for inválido', async () => {
      const response = await request
        .post('/products')
        .set('x-access-token', 'token_invalido')

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Token Inválido',
      })
    })
  })

  // it('POST /authenticate', async () => {
  //   const response = await request.get('/')
  // })

  // it('POST /refresh-token', async () => {
  //   const response = await request.get('/')
  // })
})
