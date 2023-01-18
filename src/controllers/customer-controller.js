import * as argon2 from 'argon2themax'
import ValidationContract from '../validators/fluent-validator.js'
import * as repository from '../repositories/customer-repository.js'
import * as authService from '../services/auth-service.js'
import * as emailService from '../services/email-service.js'

const hashPassword = async (password) => {
  const options = await argon2.getMaxOptions()
  const salt = await argon2.generateSalt()
  const hash = await argon2.hash(password, salt, options)
  return { hash, salt }
}

export const post = async (req, res) => {
  const contract = new ValidationContract()
  contract.hasMinLen(
    req.body.name,
    3,
    'O nome deve conter pelo menos 3 caracteres',
  )
  contract.isEmail(req.body.email, 'E-mail inválido')
  contract.hasMinLen(
    req.body.password,
    6,
    'A senha deve conter pelo menos 6 caracteres',
  )

  // Se os dados forem inválidos
  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end()
    return
  }

  try {
    const { hash, salt } = await hashPassword(req.body.password)

    await repository.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      salt,
      roles: ['user'],
    })

    emailService.send(
      req.body.email,
      'Bem vindo ao Node Store',
      process.env.EMAIL_TMPL.replace('{0}', req.body.name),
    )

    res.status(201).send({
      message: 'Cliente cadastrado com sucesso!',
    })
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

export const authenticate = async (req, res) => {
  try {
    const customer = await repository.authenticate({
      email: req.body.email,
      password: req.body.password,
    })

    if (!customer) {
      res.status(404).send({
        message: 'Usuário ou senha inválidos',
      })
      return
    }

    const token = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      roles: customer.roles,
    })

    res.status(201).send({
      token,
      data: {
        email: customer.email,
        name: customer.name,
      },
    })
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers['x-access-token']
    const data = await authService.decodeToken(token)

    const customer = await repository.getById(data.id)

    if (!customer) {
      res.status(404).send({
        message: 'Cliente não encontrado',
      })
      return
    }

    res.status(201).send({
      token,
      data: {
        email: customer.email,
        name: customer.name,
      },
    })
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
    })
  }
}
