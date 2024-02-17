//taskControllers

const { taskFilters } = require('../helpers/filters')
const { Tasks } = require('../model/userModel')
const { service_find_one, service_find_by_id, service_get_all_tasks, service_find_by_id_and_update } = require('../services/taskServices')
const { taskSorting } = require('../helpers/sorting')
const paginate = require('../helpers/pagination')




const addTask = async (req, res, next) => {

    const { task, description } = req.body
    let user_id;

    if (req.user.usertype === 'USER') {
        user_id = req.user.id
    }
    else if (req.user.usertype === 'ADMIN') {
        user_id = req.body.user_id
        if (!user_id) return res.status(422).json({ success: false, error: 'user_id field is required' })
    }


    await Tasks.create({
        task,
        description,
        user_id
    }).then(data => {
        res.status(201).json({ success: true, message: 'Task added successfully', data: data })
    }).catch(error => {
        res.status(422).json({ success: false, error: error.message })
    })

}


const getOne = async (req, res, next) => {
    try {
        const task_id = req.params.id
        const user_id = req.user.id

        // const task = await Tasks.findOne({ _id: task_id })
        const task = await service_find_one({ _id: task_id })//task_id should be either id or object


        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' })
        }

        if (task.user_id.valueOf() === user_id || req.user.usertype === 'ADMIN') {
            return res.status(200).json({ success: true, message: 'Successfully retrieved one task', data: task })
        }

        return res.status(403).json({ success: false, error: 'You do not have access to retrieve other users task' })
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message })
    }
}


const getAllTasks = async (req, res, next) => {
    try {

        const query_filter = taskFilters(req)//using req.user in filters
        const query_sort = taskSorting(req.query)

        const { limit = 10, page = 1 } = req.query

        const count = await Tasks.countDocuments(query_filter)

        const tasks = await service_get_all_tasks(query_filter, query_sort, page, limit)
        // const tasks = await Tasks.find(query_filter).populate({ path: 'user_id', select: 'id username first_name' })

        const response = paginate(tasks, page, limit, count)

        return res.status(200).json({ success: true, message: 'Successfully fetched all tasks', ...response })
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
}


const updateTask = async (req, res, next) => {
    try {

        const task_id = req.params.id
        const user_id = req.user.id

        const tasks = await service_find_one({ _id: task_id })
        // const tasks = await Tasks.findOne({ _id: task_id })


        if (!tasks) {
            return res.status(404).json({ success: false, error: 'Task not found' })
        }
        const updatedData = req.body
        const options = { new: true }

        if (tasks.user_id.valueOf() === user_id || req.user.usertype === 'ADMIN') {
            const result = await service_find_by_id_and_update(task_id, updatedData, options)
            // const result = await Tasks.findByIdAndUpdate(task_id, updatedData, options)

            return res.status(200).json({ success: true, message: 'Successfully updated the task', data: result })

        }
        return res.status(403).json({ success: false, error: 'You do not have access to update other users tasks' })


    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}


const deleteTask = async (req, res, next) => {
    try {
        const task_id = req.params.id
        const user_id = req.user.id

        //check if task_id is users task or others task
        const tasks = await service_find_one({ _id: task_id })
        // const tasks = await Tasks.findOne({ _id: task_id })

        if (!tasks) {
            return res.status(404).json({ success: false, error: 'Task not found' })
        }
        if (tasks.user_id.valueOf() === user_id || req.user.usertype === 'ADMIN') {
            const result = await service_find_by_id_and_delete(task_id)
            // const result = await Tasks.findByIdAndDelete(task_id)

            return res.status(200).json({ success: true, message: 'Task deleted successfully' })
        }
        return res.status(403).json({ success: false, error: 'You do not have access to delete other users tasks' })

    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}



module.exports = { addTask, getOne, getAllTasks, updateTask, deleteTask }