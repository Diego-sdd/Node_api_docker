import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { check, validationResult } from 'express-validator'
import authConfig from '@config/auth.json'

import GetUsersModel from '@models/usersModel/getUserModels'

const generateToken = (params = {}) => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

class Users {
  async login (request, response) {
    const {
      email,
      password
    } = request.query

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() })
    }

    if (!email || !password) {
      return response.status(404).json({ body: 'missing information' })
    }

    const checkEmail = await check('email')
      .notEmpty()
      .isEmail()
      .run(request)

    const checkPassword = await check('password')
      .notEmpty()
      .isLength({ min: 5 })
      .run(request)

    if (checkEmail.context.errors.length > 0 ||
        checkPassword.context.errors.length > 0) {
      return response.status(406).json({
        error: 'incorrect parameters'
      })
    }

    try {
      const resultRegisterUser = await GetUsersModel.getUserRegister(email)

      if (resultRegisterUser.length === 0) {
        return response.status(404).json({ body: 'User not found' })
      } else {
        if (!await bcryptjs.compare(password, resultRegisterUser[0].password)) {
          return response.status(404).send({ error: 'Invalid password' })
        }

        delete resultRegisterUser[0].cd_senha

        return response.status(200).json({
          body: {
            email: resultRegisterUser[0].email,
            token: generateToken({ id: resultRegisterUser[0].id })
          }
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }
}
export default new Users()
