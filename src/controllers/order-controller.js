import { nanoid } from 'nanoid'
import * as repository from '../repositories/order-repository.js'
import * as authService from '../services/auth-service.js'

export const get = async (_req, res) => {
  try {
    const data = await repository.get()
    res.status(200).send(data)
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

export const post = async (req, res) => {
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
