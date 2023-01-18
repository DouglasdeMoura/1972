import Customer from '../models/customer.js'

export const create = async (data) => {
  const customer = new Customer(data)
  await customer.save()
}

export const authenticate = async (data) => {
  const res = await Customer.findOne({
    email: data.email,
    password: data.password,
  })
  return res
}

export const getById = async (id) => {
  const res = await Customer.findById(id)
  return res
}
