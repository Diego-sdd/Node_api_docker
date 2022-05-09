import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { check, validationResult } from 'express-validator'
import authConfig from '@config/auth.json'

import InsertUsersModel from '@models/usersModel/insertUsersModel'
import GetUsersModel from '@models/usersModel/getUserModels'

const generateToken = (params = {}) => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

class RegisterUser {
  async index (request, response) {
    const {
      email,
      password,
      profile
    } = request.body

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() })
    }

    if (!email || !password || !profile) {
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

    const checkProfile = await check('profile')
      .notEmpty()
      .custom((value) => {
        const validUserTypes = [
          'User',
          'Admin'
        ]
        return validUserTypes.includes(value)
      })
      .run(request)

    if (checkEmail.context.errors.length > 0 ||
      checkProfile.context.errors.length > 0 ||
      checkPassword.context.errors.length > 0) {
      return response.status(406).json({
        error: 'incorrect parameters'
      })
    }

    try {
      const [checkUserEmail] = await GetUsersModel.getUserRegister(email)

      if (checkUserEmail) {
        return response.status(409).json({ error: 'this user is already registered' })
      }

      const hashPassword = await bcryptjs.hash(password, 10)

      const resultInsert = await InsertUsersModel.insertUser(email,
        hashPassword, profile)

      if (resultInsert.length > 0) {
        return response.status(200).json({
          body: {
            email,
            token: generateToken({ id: resultInsert[0] })
          }
        })
      } else {
        return response.status(500).json({ error: 'error registering user' })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }
}
export default new RegisterUser()
