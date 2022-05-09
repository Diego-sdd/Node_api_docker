import { check, validationResult } from 'express-validator'
import InsertTasksModel from "@models/tasksModel/insertTasksModel"

class RegisterTasks {
  async RegisterTasksUser(request, response) {
    const {
      description,
      status,
      deadline,
      user_id
    } = request.body

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() })
    }

    if (!description || !status || !deadline || !user_id) {
      return response.status(404).json({ body: 'missing information' })
    }

    const checkDeadline = await check('deadline')
      .notEmpty()
      .isISO8601().toDate()
      .run(request)

    const checkUserId = await check('user_id')
      .notEmpty()
      .isNumeric()
      .run(request)

    const checkStatus = await check('status')
      .notEmpty()
      .custom((value) => {
        const validUserTypes = [
          'Todo',
          'Done'
        ];
        return validUserTypes.includes(value);
      })
      .run(request)


    if (
      checkDeadline.context.errors.length > 0 ||
      checkUserId.context.errors.length > 0 ||
      checkStatus.context.errors.length > 0
    ) {
      return response.status(406).json({
        error: 'incorrect parameters'
      })
    }

    try {
      const resultInsert = await InsertTasksModel.insertUserTask(
        description,
        status,
        deadline,
        user_id
      )

      if (resultInsert.length > 0) {
        return response.status(200).json({
          body: resultInsert[0]
        })
      } else {
        return response.status(500).json({ error: 'error registering user' })
      }
    } catch (error) {
      return response.status(500).json({ error })
    }
  }
}
export default new RegisterTasks()
