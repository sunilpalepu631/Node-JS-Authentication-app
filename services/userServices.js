//services i.e. database queries we should write here


//find()
//findOne()
//findById()
//findByIdAndUpdate()
//findByIdAndDelete()

// import { Tasks } from '../model/userModel'
const { User } = require('../model/userModel')
const bcrypt = require('bcryptjs')


class UserServices {

    async createUser(body) {

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


    async findOneUser(filter) {

        const user = await User.findOne(filter)

        return user
    }


    async getOneUserById(id) {

        const user = await User.findById(id, { password: 0 })

        return user
    }

    async getAllUsers(filter, sort, limit, page) {


        const users = await User.find(filter, { password: 0 })
            .sort(sort)
            .limit(limit)
            .skip((page - 1) * limit)
            .exec()

        return users
    }




    async updateUser(user_id, updatedData, options) {
        const result = await User.findByIdAndUpate(user_id, updatedData, options)
        return result
    }

    async deleteUser(user_id) {
        const result = await User.findByIdAndDelete(user_id)
        return result
    }
}

// module.exports = {
//     service_create_user,
//     service_find_one,
//     service_find_by_id,
//     service_get_all_users,
//     service_find_by_id_and_update,
//     service_find_by_id_and_delete,
// }


const userServices = new UserServices()
module.exports = userServices
