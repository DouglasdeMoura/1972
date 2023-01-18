import supertest from 'supertest'
import { setup, teardown } from 'vitest-mongodb'

import app from '../src/app.js'

beforeAll(async () => {
  await setup()
  vi.mock('../src/config', async () => {
    return {
      default: {
        connectionString: 'mongodb://127.0.0.1:60567/',
        sendgridKey: process.env.SENDGRID_KEY,
        containerConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      },
    }
  })
})

afterAll(async () => {
  await teardown()
})

export const request = supertest(app)
