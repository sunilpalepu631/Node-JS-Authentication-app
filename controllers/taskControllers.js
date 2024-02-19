//taskControllers

const { taskFilters } = require('../helpers/filters')
const { Tasks } = require('../model/userModel')
const TaskServices = require('../services/taskServices')
const { taskSorting } = require('../helpers/sorting')
const paginate = require('../helpers/pagination')
const { model } = require('mongoose')
const constants = require('../constants/messageConstants')

class TaskController {

    async addTask(req, res, next) {
        try {
            const { task, description } = req.body
            let user_id;

            if (req.user.usertype === 'USER') {
                user_id = req.user.id
            }
            else if (req.user.usertype === 'ADMIN') {
                user_id = req.body.user_id
                if (!user_id) return res.status(422).json({ success: false, error: constants.USER_ID_FIELD_REQUIRED })
            }


            const taskData = await TaskServices.createTask({ task, description, user_id })

            res.status(201).json({ success: true, message: constants.TASK_CREATED, data: taskData })
        }
        catch (error) {
            res.status(422).json({ success: false, error: error.message })

        }
        //

    }


    async getOne(req, res, next) {
        try {
            const task_id = req.params.id
            const user_id = req.user.id

            // const task = await Tasks.findOne({ _id: task_id })
            const task = await TaskServices.findOne({ _id: task_id })//task_id should be either id or object


            if (!task) {
                return res.status(404).json({ success: false, error: constants.TASK_NOT_FOUND })
            }

            if (task.user_id.valueOf() === user_id || req.user.usertype === 'ADMIN') {
                return res.status(200).json({ success: true, message: constants.FETCHED_TASK, data: task })
            }

            return res.status(403).json({ success: false, error: constants.NOT_AUTH_TO_VIEW })
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message })
        }
    }


    async getAllTasks(req, res, next) {
        try {

            const query_filter = taskFilters(req)//using req.user in filters
            const query_sort = taskSorting(req.query)

            const { limit = 10, page = 1 } = req.query

            const count = await Tasks.countDocuments(query_filter)

            const tasks = await TaskServices.getAllTasks(query_filter, query_sort, page, limit)
            // const tasks = await Tasks.find(query_filter).populate({ path: 'user_id', select: 'id username first_name' })

            const response = paginate(tasks, page, limit, count)

            return res.status(200).json({ success: true, message: constants.FETECHED_TASKS, ...response })
        }
        catch (err) {
            return res.status(500).json({ success: false, error: err.message })
        }
    }


    async updateTask(req, res, next) {
        try {

            const task_id = req.params.id
            const user_id = req.user.id

            const tasks = await TaskServices.findOne({ _id: task_id })
            // const tasks = await Tasks.findOne({ _id: task_id })


            if (!tasks) {
                return res.status(404).json({ success: false, error: constants.TASK_NOT_FOUND })
            }
            const updatedData = req.body
            const options = { new: true }

            if (tasks.user_id.valueOf() === user_id || req.user.usertype === 'ADMIN') {
                const result = await TaskServices.updateTask(task_id, updatedData, options)
                // const result = await Tasks.findByIdAndUpdate(task_id, updatedData, options)

                return res.status(200).json({ success: true, message: constants.UPDATED_TASK, data: result })

            }
            return res.status(403).json({ success: false, error: constants.NOT_AUTH_TO_UPDATE })


        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }


    async deleteTask(req, res, next) {
        try {
            const task_id = req.params.id
            const user_id = req.user.id

            //check if task_id is users task or others task
            const tasks = await TaskServices.findOne({ _id: task_id })
            // const tasks = await Tasks.findOne({ _id: task_id })

            if (!tasks) {
                return res.status(404).json({ success: false, error: constants.TASK_NOT_FOUND })
            }
            if (tasks.user_id.valueOf() === user_id || req.user.usertype === 'ADMIN') {
                const result = await TaskServices.deleteTask(task_id)
                // const result = await Tasks.findByIdAndDelete(task_id)

                return res.status(200).json({ success: true, message: constants.TASK_DELETED })
            }
            return res.status(403).json({ success: false, error: constants.NOT_AUTH_TO_DELETE })

        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }
}


// module.exports = { addTask, getOne, getAllTasks, updateTask, deleteTask }
module.exports = TaskController