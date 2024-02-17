//services i.e. database queries we should write here


//find()
//findOne()
//findById()
//findByIdAndUpdate()
//findByIdAndDelete()

// import { Tasks } from '../model/userModel'
const { User } = require('../model/userModel')
const bcrypt = require('bcryptjs')




const service_create_user = async (body) => {

    const { email, password, first_name, last_name, dob, address, phone_number, age, usertype } = body
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        dob,
        address,
        phone_number,
        age,
        usertype
    })
    return newUser
}


const service_find_one = (object) => {

    const user = User.findOne(object)

    return user
}


const service_find_by_id = (id) => {

    const user = User.findById(id, { password: 0 })

    return user
}

const service_get_all_users = (filter, sort, limit, page) => {


    const data = User.find(filter, { password: 0 })
        .sort(sort)
        .limit(limit)
        .skip((page - 1) * limit)
        .exec()

    return data
}




function service_find_by_id_and_update(user_id, updatedData, options) {
    const result = User.findByIdAndUpate(user_id, updatedData, options)
    return result
}

function service_find_by_id_and_delete(user_id) {
    const result = User.findByIdAndDelete(user_id)
    return result
}


module.exports = {
    service_create_user,
    service_find_one,
    service_find_by_id,
    service_get_all_users,
    service_find_by_id_and_update,
    service_find_by_id_and_delete,
}
