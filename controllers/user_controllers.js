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
const UserServices = require('../services/userServices');
const { response } = require('express');
const constants = require('../constants/messageConstants');
const { model } = require('mongoose');
const { checkPreferences } = require('joi');




class UserController {

    // register user api
    async register(req, res, next) {

        try {
            const user = await UserServices.createUser(req.body)
            res.status(201).json({ success: true, message: constants.USER_ADDED, data: user, });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }




    // User login api
    async login(req, res, next) {

        try {
            const { email, password } = req.body

            // const user = await User.findOne({ email })
            const user = await UserServices.findOneUser({ email })

            // console.log('user = ', user)

            if (!user) {
                res.status(404).json({ success: false, error: constants.EMAIL_NOT_FOUND, })
            }
            else {
                bcrypt.compare(password, user.password).then(function (result) {
                    if (result) {
                        const maxAge = 3 * 60 * 60;
                        const token = jwt.sign(
                            { id: user._id, password: user.password }, jwtSecret, { expiresIn: maxAge, } // 3hrs in sec
                        );
                        // console.log('token = ', token)

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
    async getOneUser(req, res, next) {
        try {
            const user_id = req.params.id

            const user = await UserServices.getOneUserById(user_id)
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
    async getAllUsers(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;

            const query_filter = userFilters(req.query)
            const query_sort = userSorting(req.query)

            const count = await User.countDocuments(query_filter);

            const users = await UserServices.getAllUsers(query_filter, query_sort, limit, page)
            // const query = await User.find(query_filter, { password: 0 }).sort(query_sort)
            const response = paginate(users, page, limit, count)

            // res.render('home', { data: response })
            res.status(200).json({ success: true, message: constants.FETCHED_USERS, ...response });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };




    // get one api
    async getProfile(req, res) {
        try {
            const data = req.user//data getting from middle ware
            res.status(200).json({ success: true, message: constants.SUCCESS_RETRIEVED_USER, 'data': data })
        }
        catch (error) {
            res.status(500).json({ success: false, 'error': error.message })
        }
    }





    // need to implement update user details  api
    // update api
    async updateUser(req, res) {
        try {
            const user_id = req.user.id;
            const given_id = req.params.id

            if (given_id !== user_id) {
                return res.status(403).json({ success: false, error: constants.NOT_AUTH_TO_UPDATE_PROFILE })
            }
            const updatedData = req.body;
            const options = { new: true };

            const result = await UserServices.updateUser(
                user_id, updatedData, options
            )
            return res.status(200).json({ success: true, message: constants.UPDATED_PROFILE, 'data': result })
        }
        catch (error) {
            return res.status(500).json({ success: false, 'error': error.message })
        }
    }




    async updatePassword(req, res, next) {
        try {
            const { email, password, confirm_password } = req.body

            const user = await UserServices.findOneUser({ email });

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




    async forgetPassword(req, res, next) {
        try {
            const email = req.body.email

            const user = await UserServices.findOneUser({ email })
            if (!user) {
                return res.status(404).json({ success: false, error: constants.EMAIL_NOT_FOUND })
            }


            const hostName = req.hostname;
            const port = process.env.PORT

            const message = `http://${hostName}:${port}/user/updatepassword`

            const response = await sendMail(email, message)

            return res.status(200).json({ success: true, message: constants.EMAIL_SENT })
        }
        catch (error) {
            return res.status(404).json({ success: false, error: error.message })
        }



    }




    // Delete api
    async deleteUser(req, res) {
        try {
            const user_id = req.user.id;
            const given_id = req.params.id

            if (given_id === user_id || req.user.usertype == 'ADMIN') {
                const data = await UserServices.deleteUser(given_id)
                if (!data) {
                    return res.status(404).json({ success: false, error: constants.USER_NOT_FOUND });
                }
                return res.json({ success: true, message: `USER with first name: ${data.first_name} has been deleted...` })
            }

            return res.status(403).json({ success: false, error: constants.NOT_AUTH_TO_DELETE_PROFILE })
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }
}

// Usage:
const userController = new UserController();

module.exports = userController
