import Product from '../models/product.js'

const get = async () => {
  const res = await Product.find(
    {
      active: true,
    },
    'title price slug',
  )
  return res
}

const getBySlug = async (slug) => {
  const res = await Product.findOne(
    {
      slug,
      active: true,
    },
    'title description price slug tags',
  )
  return res
}

const getById = async (id) => {
  const res = await Product.findById(id)
  return res
}

const getByTag = async (tag) => {
  const res = Product.find(
    {
      tags: tag,
      active: true,
    },
    'title description price slug tags',
  )
  return res
}

const create = async (data) => {
  const product = new Product(data)
  await product.save()
}

const update = async (id, data) => {
  await Product.findByIdAndUpdate(id, {
    $set: {
      title: data.title,
      description: data.description,
      price: data.price,
      slug: data.slug,
    },
  })
}

const deleteById = async (id) => {
  await Product.findOneAndRemove(id)
}

export default {
  get,
  getBySlug,
  getById,
  getByTag,
  create,
  update,
  delete: deleteById,
}
