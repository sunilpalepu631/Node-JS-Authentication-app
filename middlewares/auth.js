//authentication middleware

const jwt = require("jsonwebtoken")
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET_KEY
const { User } = require('../model/userModel')
const UserServices = require('../services/userServices')
const constants = require('../constants/messageConstants')



exports.BasicAuth = async (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, error: constants.TOKEN_REQUIRED })
    }


    jwt.verify(token, jwtSecret, async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ success: false, error: err.message })
        }
        if (!decodedToken) {
            return res.status(401).json({ success: false, error: constants.INVALID_TOKEN });
        }
        try {

            // const data = await UserServices.getOneUserById(decodedToken.id);
            const data = await User.findOne({ '_id': decodedToken.id, 'password': decodedToken.password })

            if (!data) {
                return res.status(401).json({ success: false, error: constants.INVALID_TOKEN })
            }
            req.user = data;
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message })
        }

        // If the user exists, you can attach it to the request object for further use
        // req.user = user;

        // Proceed to the next middleware
        next();
    });

}




exports.AdminAuth = async (req, res, next) => {
    user = req.user

    if (user.usertype === 'ADMIN') {
        next()
    }
    else {
        return res.status(403).json({ success: false, error: constants.ACCESS_DENIED })
    }
}