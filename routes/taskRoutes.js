
const express = require('express')
const router = express.Router()

const { BasicAuth, AdminAuth } = require('../auth');
const taskController = require('../controllers/taskControllers')



router.post('/add-task', BasicAuth, taskController.addTask)
router.get('/getalltasks', BasicAuth, taskController.getAllTasks)

module.exports = router