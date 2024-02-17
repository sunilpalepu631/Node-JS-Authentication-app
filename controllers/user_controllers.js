// userControllers

const { User } = require('../model/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET_KEY
const sendMail = require('../helpers/nodemailer')
const { userFilters } = require('../helpers/filters')
const { userSorting } = require('../helpers/sorting')
const paginate = require('../helpers/pagination')
const { service_create_user, service_find, service_find_one, service_find_by_id, service_get_all_users, } = require('../services/userServices');
const { response } = require('express');
const constants = require('../constants/messageConstants')




// register user api
const register = async (req, res, next) => {

    try {
        const user = await service_create_user(req.body)
        res.status(201).json({ success: true, message: constants.USER_ADDED, data: user, });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}




// User login api
const login = async (req, res, next) => {

    try {
        const { email, password } = req.body

        // const user = await User.findOne({ email })
        const user = await service_find_one({ email })

        if (!user) {
            res.status(404).json({ success: false, error: constants.EMAIL_NOT_FOUND, })
        }
        else {
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id }, jwtSecret, { expiresIn: maxAge, } // 3hrs in sec
                    );

                    res.status(201).json({ success: true, message: constants.LOGIN_SUCCESS, 'access_token': token });
                } else {
                    res.status(401).json({ success: false, error: constants.INCORRECT_PASSWORD });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}





//getone user by id api
const getOneUser = async (req, res, next) => {
    try {
        user_id = req.params.id

        const user = await service_find_by_id(user_id)
        if (!user) {
            return res.status(404).json({ success: false, error: constants.USER_NOT_FOUND })
        }
        return res.status(200).json({ success: true, message: constants.SUCCESS_RETRIEVED_USER, data: user })
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message })
    }
}




// get all api
const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        query_filter = userFilters(req.query)
        query_sort = userSorting(req.query)

        const count = await User.countDocuments(query_filter);

        const users = await service_get_all_users(query_filter, query_sort, limit, page)
        // const query = await User.find(query_filter, { password: 0 }).sort(query_sort)
        const response = paginate(users, page, limit, count)

        res.status(200).json({ success: true, message: constants.FETCHED_USERS, ...response });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




// get one api
const getProfile = async (req, res) => {
    try {
        data = req.user//data getting from middle ware
        res.status(200).json({ success: true, message: constants.SUCCESS_RETRIEVED_USER, 'data': data })
    }
    catch (error) {
        res.status(500).json({ success: false, 'error': error.message })
    }
}





// need to implement update user details  api
// update api
const updateUser = async (req, res) => {
    try {
        const user_id = req.user.id;
        const given_id = req.params.id

        if (given_id !== user_id) {
            return res.status(403).json({ success: false, error: constants.NOT_AUTH_TO_UPDATE_PROFILE })
        }
        const updatedData = req.body;
        const options = { new: true };

        const result = await User.findByIdAndUpdate(
            user_id, updatedData, options
        )
        return res.status(200).json({ success: true, message: constants.UPDATED_PROFILE, 'data': result })
    }
    catch (error) {
        return res.status(500).json({ success: false, 'error': error.message })
    }
}




const updatePassword = async (req, res, next) => {
    try {
        const { email, password, confirm_password } = req.body

        // Check if passwords match
        // if (password !== confirm_password) {
        //     return res.status(400).json({ success: false, error: constants.PASSWORD_AND_CONFIRM_PASSWORD });
        // }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: constants.EMAIL_NOT_FOUND });
        }

        // Hash the new password
        const hash = await bcrypt.hash(password, 10);

        // Update user password
        user.password = hash;
        await user.save();

        return res.status(200).json({ success: true, message: constants.PASSWORD_CHANGED });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};




const forgetPassword = async (req, res, next) => {
    try {
        const email = req.body.email

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, error: 'Email not found' })
        }


        const hostName = req.hostname;
        const port = process.env.PORT

        const message = `http://${hostName}:${port}/user/updatepassword`

        const response = await sendMail(email, message)

        return res.status(200).json({ success: true, message: 'Email sent successful' })
    }
    catch (error) {
        return res.status(404).json({ success: false, error: error.message })
    }



}




// Delete api
const deleteUser = async (req, res) => {
    try {
        const user_id = req.user.id;
        const given_id = req.params.id

        if (given_id === user_id || req.user.usertype == 'ADMIN') {
            const data = await User.findByIdAndDelete(given_id)
            if (!data) {
                return res.status(404).json({ success: false, error: "User not found" });
            }
            return res.json({ success: true, message: `USER with first name: ${data.first_name} has been deleted...` })
        }

        return res.status(403).json({ success: false, error: "you can not delete other user" })
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}




module.exports = {
    register,
    login,
    getOneUser,
    getProfile,
    getAllUsers,
    updateUser,
    deleteUser,
    forgetPassword,
    updatePassword
}


