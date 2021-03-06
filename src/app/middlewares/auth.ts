import jwt from 'jsonwebtoken'
import authConfig from '@config/auth.json'

const handle = (request, response, next) => {
  const authHeader = request.headers.authorization

  if (!authHeader) { return response.status(401).send({ error: 'No token provided' }) }

  const parts: any = authHeader.split(' ')

  if (parts.length !== 2) { return response.status(401).send({ error: 'Token error' }) }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) { return response.status(401).send({ error: 'Token malformatted' }) }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) { return response.status(401).send({ error: 'Token invalid' }) }

    response.userId = decoded.id
    return next()
  })
}

export default handle
