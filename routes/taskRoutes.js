
const express = require('express')
const router = express.Router()

const { BasicAuth, AdminAuth } = require('../auth');
const taskController = require('../controllers/taskControllers')



router.get('/', BasicAuth, taskController.getAllTasks)
router.post('/', BasicAuth, taskController.addTask)
router.get('/:id', BasicAuth, taskController.getOne)
router.put('/:id', BasicAuth, taskController.updateTask)
router.delete('/:id', BasicAuth, taskController.deleteTask)

module.exports = router