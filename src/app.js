import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import config from './config.js'

// Carrega as Rotas
import indexRoute from './routes/index-route.js'
import productRoute from './routes/product-route.js'
import customerRoute from './routes/customer-route.js'
import orderRoute from './routes/order-route.js'

const app = express()

const databaseConnect = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(config.connectionString)
  } catch (error) {
    console.error(error)
  }
}

databaseConnect()

app.use(
  bodyParser.json({
    limit: '5mb',
  }),
)
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)

// Habilita o CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token',
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

app.use('/', indexRoute)
app.use('/products', productRoute)
app.use('/customers', customerRoute)
app.use('/orders', orderRoute)

export default app
