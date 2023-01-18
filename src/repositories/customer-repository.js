import * as argon2 from 'argon2themax'
import Customer from '../models/customer.js'

export const create = async (data) => {
  const customer = new Customer(data)
  await customer.save()
}

export const authenticate = async (data) => {
  const res = await Customer.findOne({
    email: data.email,
  })

  const match = await argon2.verify(res.password, data.password)

  if (!match) {
    return null
  }

  return res
}

export const getById = async (id) => {
  const res = await Customer.findById(id)
  return res
}
