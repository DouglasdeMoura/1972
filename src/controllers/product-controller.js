import { nanoid } from 'nanoid'
import azure from 'azure-storage'
import ValidationContract from '../validators/fluent-validator.js'
import repository from '../repositories/product-repository.js'
import config from '../config.js'

const get = async (_req, res) => {
  try {
    const data = await repository.get()
    res.status(200).send(data)
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

const getBySlug = async (req, res) => {
  try {
    const data = await repository.getBySlug(req.params.slug)
    res.status(200).send(data)
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

const getById = async (req, res) => {
  try {
    const data = await repository.getById(req.params.id)
    res.status(200).send(data)
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

const getByTag = async (req, res) => {
  try {
    const data = await repository.getByTag(req.params.tag)
    res.status(200).send(data)
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

const post = async (req, res) => {
  const contract = new ValidationContract()
  contract.hasMinLen(
    'title',
    req.body.title,
    3,
    'O título deve conter pelo menos 3 caracteres',
  )
  contract.hasMinLen(
    'slug',
    req.body.slug,
    3,
    'O slug deve conter pelo menos 3 caracteres',
  )
  contract.hasMinLen(
    'description',
    req.body.description,
    3,
    'A descrição deve conter pelo menos 3 caracteres',
  )
  contract.isNumber('price', req.body.price, 'O preço é obrigatório')

  // Se os dados forem inválidos
  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end()
    return
  }

  try {
    // Cria o Blob Service
    let filename = 'default-product.png'

    const rawdata = req.body?.image

    if (rawdata) {
      filename = `${nanoid()}.jpg`
      const matches = rawdata?.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      // const type = matches[1]

      const buffer = Buffer.from(matches[2], 'base64')

      const blobSvc = azure.createBlobService(config.containerConnectionString)
      // Salva a imagem
      await blobSvc.createBlockBlobFromText(
        'product-images',
        filename,
        buffer,
        {
          // contentType: type,
        },
        (error) => {
          if (error) {
            filename = 'default-product.png'
          }
        },
      )
    }

    await repository.create({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      active: true,
      tags: req.body.tags,
      image: `https://nodestr.blob.core.windows.net/product-images/${filename}`,
    })
    res.status(201).send({
      message: 'Produto cadastrado com sucesso!',
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

const put = async (req, res) => {
  try {
    await repository.update(req.params.id, req.body)
    res.status(200).send({
      message: 'Produto atualizado com sucesso!',
    })
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    await repository.delete(req.body.id)
    res.status(200).send({
      message: 'Produto removido com sucesso!',
    })
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

export default {
  get,
  getBySlug,
  getById,
  getByTag,
  post,
  put,
  delete: deleteProduct,
}
