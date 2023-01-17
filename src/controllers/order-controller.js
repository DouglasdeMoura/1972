'use strict'

const nanoid = require('nanoid')
const repository = require('../repositories/order-repository')
const authService = require('../services/auth-service')

exports.get = async (_req, res) => {
  try {
    const data = await repository.get()
    res.status(200).send(data)
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

exports.post = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers['x-access-token']
    const data = await authService.decodeToken(token)

    await repository.create({
      customer: data.id,
      number: nanoid(6),
      items: req.body.items,
    })
    res.status(201).send({
      message: 'Pedido cadastrado com sucesso!',
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}
