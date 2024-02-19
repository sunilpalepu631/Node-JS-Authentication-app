//services i.e. database queries we should write here


//find()
//findOne()
//findById()
//findByIdAndUpdate()
//findByIdAndDelete()

const { Tasks } = require('../model/userModel')

class TaskServices {

    async createTask(data) {
        const taskData = await Tasks.create(data)
        return taskData
    }



    async find(query_filter, query_sort) {
        const task = Tasks.find(query_filter, { password: 0 }).sort(query_sort)
        return task
    }

    async findOne(query_filter, query_sort) {

        const task = Tasks.findOne(query_filter)

        return task
    }


    async findById(id) {

        const task = Tasks.findById(id)

        return task
    }

    async getAllTasks(filter, sort, page, limit) {
        return Tasks.find(filter)
            .populate({ path: 'user_id', select: 'id username first_name' })
            .sort(sort)
            .limit(limit)
            .skip((page - 1) * limit)
            .exec()
    }



    async updateTask(task_id, updatedData, options) {
        const result = Tasks.findByIdAndUpdate(task_id, updatedData, options)
        return result
    }

    async deleteTask(task_id) {
        const result = Tasks.findByIdAndDelete(task_id)
        return result
    }
}


const taskServices = new TaskServices();


module.exports = taskServices
