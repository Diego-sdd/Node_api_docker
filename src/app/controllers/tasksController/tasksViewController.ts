import { check, validationResult } from 'express-validator'
import GetTasksModel from '@models/tasksModel/getTasksModel'
import GetUsersModel from '@models/usersModel/getUserModels'

class ViewTasks {
  async ViewTaskUser (request, response) {
    const {
      idUser
    } = request.query

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() })
    }

    if (!idUser) {
      return response.status(404).json({ body: 'missing information' })
    }

    const checkUserId = await check('idUser')
      .notEmpty()
      .isNumeric()
      .run(request)

    if (checkUserId.context.errors.length > 0) {
      return response.status(406).json({
        error: 'incorrect parameters'
      })
    }

    try {
      const resultUpdate = await GetTasksModel.getTaskFilterUser(
        idUser
      )

      resultUpdate.map((e, k) => {
        if (e.deadline > new Date()) {
          resultUpdate[k].lateTask = false
        } else {
          resultUpdate[k].lateTask = true
        }
        return null
      })
      return response.status(200).json({
        body: resultUpdate
      })
    } catch (error) {
      return response.status(500).json({ error })
    }
  }

  async ViewAllTask (request, response) {
    const {
      email,
      page,
      pageSize,
      order,
      orderBy
    } = request.query

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() })
    }

    if (!email) {
      return response.status(404).json({ body: 'missing information' })
    }

    const checkUserId = await check('email')
      .notEmpty()
      .isEmail()
      .run(request)

    if (checkUserId.context.errors.length > 0) {
      return response.status(406).json({
        error: 'incorrect parameters'
      })
    }

    try {
      const [resultCheckUser] = await GetUsersModel.getUserRegister(email)

      if (resultCheckUser.profile === 'Admin') {
        const resultUpdate = await GetTasksModel.getTasksAll(
          page,
          pageSize,
          order,
          orderBy
        )

        return response.status(200).json({
          body: resultUpdate
        })
      } else {
        return response.status(203).json({ error: 'user not allowed' })
      }
    } catch (error) {
      return response.status(500).json({ error })
    }
  }

  async ViewAllTaskLate (request, response) {
    const {
      email,
      page,
      pageSize,
      order,
      orderBy
    } = request.query

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() })
    }

    if (!email) {
      return response.status(404).json({ body: 'missing information' })
    }

    const checkUserId = await check('email')
      .notEmpty()
      .isEmail()
      .run(request)

    if (checkUserId.context.errors.length > 0) {
      return response.status(406).json({
        error: 'incorrect parameters'
      })
    }

    try {
      const [resultCheckUser] = await GetUsersModel.getUserRegister(email)

      if (resultCheckUser.profile === 'Admin') {
        const resultUpdate = await GetTasksModel.getTasksAllLate(
          page,
          pageSize,
          order,
          orderBy
        )

        return response.status(200).json({
          body: resultUpdate
        })
      } else {
        return response.status(203).json({ error: 'user not allowed' })
      }
    } catch (error) {
      return response.status(500).json({ error })
    }
  }
}
export default new ViewTasks()
