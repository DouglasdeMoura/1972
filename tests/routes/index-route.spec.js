import { describe, expect, it } from 'vitest'

import { request } from '../../.vitest/setup.js'

describe('index-route', () => {
  it('GET /', async () => {
    const response = await request.get('/')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      title: 'Node Store API',
      version: '0.0.2',
    })
  })
})
