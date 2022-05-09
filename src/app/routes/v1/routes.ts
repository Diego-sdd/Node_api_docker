import express from 'express'

// Safety
import authMiddleware from '@src/app/middlewares/auth'

// Usersx
import RegisterUsers from '@controllers/usersController/userRegisterController'
import GetUsers from '@controllers/usersController/userGetController'

// Tasks
import RegisterTasks from '@controllers/tasksController/tasksRegisterController'
import UpdateTasks from '@controllers/tasksController/tasksUpdateController'
import ViewTasks from '@controllers/tasksController/tasksViewController'

const router = express.Router()

router.post('/register_user', RegisterUsers.index)

router.get('/login_user', GetUsers.login)

router.post('/insertTasks', authMiddleware, RegisterTasks.RegisterTasksUser)

router.put('/finishTask', authMiddleware, UpdateTasks.FinishTaskUser)

router.put('/updateTask', authMiddleware, UpdateTasks.UpdateTaskUser)

router.get('/getTaskUser', authMiddleware, ViewTasks.ViewTaskUser)

router.get('/getTaskAll', authMiddleware, ViewTasks.ViewAllTask)

router.get('/getTaskAllLate', authMiddleware, ViewTasks.ViewAllTaskLate)

export default router.use('/v1', router)
