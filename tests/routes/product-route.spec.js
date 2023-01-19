import { afterAll, describe, expect, it } from 'vitest'

import { request } from '../../.vitest/setup.js'
import { generateToken } from '../../src/services/auth-service.js'

const SALT_KEY = process.env.SALT_KEY
process.env.SALT_KEY = 'minha-chave-secreta'

afterAll(() => {
  process.env.SALT_KEY = SALT_KEY
})

describe('customer-route', () => {
  describe('POST /products', async () => {
    const user = await generateToken({
      id: 1,
      email: 'test+user@example.com',
      roles: ['user'],
    })
    const admin = await generateToken({
      id: 1,
      email: 'test+admin@example.com',
      roles: ['admin'],
    })

    it('deve retornar 401 quando não houver token no cabeçalho', async () => {
      const response = await request.post('/products')

      expect(response.status).toBe(401)
      expect(response.headers['content-type']).toBe(
        'application/problem+json; charset=utf-8',
      )
      expect(response.body.status).toBe(401)
      expect(response.body.title).toBe('Esquema de autenticação inválido')
      expect(response.body.type).toMatch(
        /http:\/\/127\.0\.0\.1:(\d*)\/products/,
      )
    })

    it('deve retornar 401 quando o token no cabeçalho for vazio', async () => {
      const response = await request
        .post('/products')
        .set('Authorization', 'Bearer')

      expect(response.status).toBe(401)
      expect(response.headers['content-type']).toBe(
        'application/problem+json; charset=utf-8',
      )
      expect(response.body.status).toBe(401)
      expect(response.body.title).toBe('Token inválido')
      expect(response.body.type).toMatch(
        /http:\/\/127\.0\.0\.1:(\d*)\/products/,
      )
    })

    it('deve retornar 401 quando o token no cabeçalho for inválido', async () => {
      const response = await request
        .post('/products')
        .set('Authorization', 'Bearer token-invalido')

      expect(response.status).toBe(401)
      expect(response.headers['content-type']).toBe(
        'application/problem+json; charset=utf-8',
      )
      expect(response.body.status).toBe(401)
      expect(response.body.title).toBe('Token inválido')
      expect(response.body.type).toMatch(
        /http:\/\/127\.0\.0\.1:(\d*)\/products/,
      )
    })

    it('deve negar o acesso para usuários que não tenha a role de "admin"', async () => {
      const response = await request
        .post('/products')
        .set('Authorization', `Bearer ${user}`)

      expect(response.status).toBe(403)
      expect(response.headers['content-type']).toBe(
        'application/problem+json; charset=utf-8',
      )
      expect(response.body.status).toBe(403)
      expect(response.body.title).toBe(
        'Esta funcionalidade é restrita para administradores',
      )
      expect(response.body.type).toMatch(
        /http:\/\/127\.0\.0\.1:(\d*)\/products/,
      )
    })

    it.skip('deve validar o payload da requisição', async () => {
      const response = await request
        .post('/products')
        .set('Authorization', `Bearer ${admin}`)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        message: 'Esta funcionalidade é restrita para administradores',
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
