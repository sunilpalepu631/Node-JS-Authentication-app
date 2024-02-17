//task routes

const express = require('express')
const router = express.Router()

const { BasicAuth, AdminAuth } = require('../middlewares/auth');
const taskController = require('../controllers/taskControllers');
const { validationMiddleware, taskAddSchema } = require('../middlewares/joiUserValidators');



router.get('/', BasicAuth, taskController.getAllTasks)
router.post('/', BasicAuth, validationMiddleware(taskAddSchema), taskController.addTask)
router.get('/:id', BasicAuth, taskController.getOne)
router.put('/:id', BasicAuth, taskController.updateTask)
router.delete('/:id', BasicAuth, taskController.deleteTask)

module.exports = router