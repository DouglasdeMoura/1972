import jwt from 'jsonwebtoken'

export const generateToken = async (data) => {
  return jwt.sign(data, process.env.SALT_KEY, { expiresIn: '1d' })
}

export const decodeToken = async (token) => {
  const data = await jwt.verify(token, process.env.SALT_KEY)
  return data
}

export const authorize = function (req, res, next) {
  const [authScheme, token] = req.headers?.authorization?.split(' ') ?? []

  if (authScheme || authScheme !== 'Bearer') {
    res.status(401).json({
      message: 'Esquema de autenticação inválido',
    })
  }

  if (!token) {
    res.status(401).json({
      message: 'Acesso Restrito',
    })
  } else {
    jwt.verify(token, process.env.SALT_KEY, (error) => {
      if (error) {
        res.status(401).json({
          message: 'Token Inválido',
        })
      } else {
        next()
      }
    })
  }
}

export const isAdmin = function (req, res, next) {
  const [authScheme, token] = req.headers?.authorization?.split(' ') ?? []

  if (!authScheme || authScheme !== 'Bearer') {
    res.status(401).json({
      message: 'Esquema de autenticação inválido',
    })
  }

  if (!token) {
    res.status(401).json({
      message: 'Token Inválido',
    })
  } else {
    jwt.verify(token, process.env.SALT_KEY, (error, decoded) => {
      if (error) {
        res.status(401).json({
          message: 'Token Inválido',
        })
      } else {
        if (decoded?.roles?.includes('admin')) {
          next()
        } else {
          res.status(403).json({
            message: 'Esta funcionalidade é restrita para administradores',
          })
        }
      }
    })
  }
}
