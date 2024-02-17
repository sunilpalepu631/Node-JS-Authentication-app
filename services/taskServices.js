//services i.e. database queries we should write here


//find()
//findOne()
//findById()
//findByIdAndUpdate()
//findByIdAndDelete()

// import { Tasks } from '../model/userModel'
const { Tasks } = require('../model/userModel')


const service_find = (query_filter, query_sort) => {
    const task = Tasks.find(query_filter, { password: 0 }).sort(query_sort)
    return task
}

const service_find_one = (query_filter, query_sort) => {

    const task = Tasks.findOne(query_filter)

    return task
}


const service_find_by_id = (id) => {

    const task = Tasks.findById(id)

    return task
}

const service_get_all_tasks = (filter, sort, page, limit) => {
    return Tasks.find(filter)
        .populate({ path: 'user_id', select: 'id username first_name' })
        .sort(sort)
        .limit(limit)
        .skip((page - 1) * limit)
        .exec()
}




function service_find_by_id_and_update(task_id, updatedData, options) {
    const result = Tasks.findByIdAndUpdate(task_id, updatedData, options)
    return result
}

function service_find_by_id_and_delete(task_id) {
    const result = Tasks.findByIdAndDelete(task_id)
    return result
}


module.exports = {
    service_find,
    service_find_one,
    service_find_by_id,
    service_get_all_tasks,
    service_find_by_id_and_update,
    service_find_by_id_and_delete,
}
