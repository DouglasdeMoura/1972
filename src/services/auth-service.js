import jwt from 'jsonwebtoken'
import HTTPError from 'src/errors/http-error'

export const generateToken = async (data) => {
  return jwt.sign(data, process.env.SALT_KEY, { expiresIn: '1d' })
}

export const decodeToken = async (token) => {
  const data = await jwt.verify(token, process.env.SALT_KEY)
  return data
}

export const authorize = (req, _res, next) => {
  const authorization = req.headers?.authorization || ''
  const [authScheme, token] = authorization?.split(' ')

  if (authScheme || authScheme !== 'Bearer') {
    throw new HTTPError(401, 'Esquema de autenticação inválido')
  }

  if (!token) {
    throw new HTTPError(401, 'Acesso Restrito')
  } else {
    jwt.verify(token, process.env.SALT_KEY, (error) => {
      if (error) {
        throw new HTTPError(401, 'Token Inválido')
      } else {
        next()
      }
    })
  }
}

export const isAdmin = (req, _res, next) => {
  const [authScheme, token] = req.headers?.authorization?.split(' ') ?? []

  if (!authScheme || authScheme !== 'Bearer') {
    throw new HTTPError(401, 'Esquema de autenticação inválido')
  }

  if (!token) {
    throw new HTTPError(401, 'Token inválido')
  } else {
    jwt.verify(token, process.env.SALT_KEY, (error, decoded) => {
      if (error) {
        throw new HTTPError(401, 'Token inválido')
      } else {
        if (decoded?.roles?.includes('admin')) {
          next()
        } else {
          throw new HTTPError(
            403,
            'Esta funcionalidade é restrita para administradores',
          )
        }
      }
    })
  }
}
