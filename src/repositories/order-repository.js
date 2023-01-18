import Order from '../models/order.js'

export const get = async () => {
  const res = await Order.find({}, 'number status customer items')
    .populate('customer', 'name')
    .populate('items.product', 'title')
  return res
}

export const create = async (data) => {
  const order = new Order(data)
  await order.save()
}
