import { check, validationResult } from 'express-validator'
import UpdateTasksModel from '@models/tasksModel/updateTasksModel'
import GetTasksModel from '@models/tasksModel/getTasksModel'
class UpdateTasks {
  async FinishTaskUser (request, response) {
    const {
      idTask
    } = request.body

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() })
    }

    if (!idTask) {
      return response.status(404).json({ body: 'missing information' })
    }

    const checkUserId = await check('idTask')
      .notEmpty()
      .isNumeric()
      .run(request)

    if (checkUserId.context.errors.length > 0) {
      return response.status(406).json({
        error: 'incorrect parameters'
      })
    }

    try {
      const resultUpdate = await UpdateTasksModel.finishUserTask(
        idTask
      )

      if (resultUpdate) {
        return response.status(200).json({
          body: 'successfully completed'
        })
      } else {
        return response.status(500).json({ error: 'error update task user' })
      }
    } catch (error) {
      return response.status(500).json({ error })
    }
  }

  async UpdateTaskUser (request, response) {
    const {
      idTask,
      description,
      deadline
    } = request.body

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() })
    }

    if (!idTask || !description || !deadline) {
      return response.status(404).json({ body: 'missing information' })
    }

    const checkUserId = await check('idTask')
      .notEmpty()
      .isNumeric()
      .run(request)

    const checkDeadline = await check('deadline')
      .notEmpty()
      .isISO8601().toDate()
      .run(request)

    if (checkUserId.context.errors.length > 0 || checkDeadline.context.errors.length > 0) {
      return response.status(406).json({
        error: 'incorrect parameters'
      })
    }

    try {
      const [resultCheckStatus] = await GetTasksModel.getTaskFilterId(
        idTask
      )

      if (resultCheckStatus.finished_at === null) {
        const resultUpdate = await UpdateTasksModel.updateUserTask(
          idTask,
          description,
          deadline
        )

        if (resultUpdate) {
          return response.status(200).json({
            body: 'successfully completed'
          })
        } else {
          return response.status(500).json({ error: 'error update task user' })
        }
      } else {
        return response.status(203).json({ error: 'This action cannot be performed. Task already completed' })
      }
    } catch (error) {
      return response.status(500).json({ error })
    }
  }
}
export default new UpdateTasks()
