const jwt = require("jsonwebtoken")
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET_KEY
const { User } = require('../model/userModel')


exports.BasicAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    // console.log(token);

    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized" })
            }
            if (!decodedToken) {
                return res.status(401).json({ message: "Not authorized" });
            }
            // console.log('decoded token = ', decodedToken)
            try {
                const data = await User.findById(decodedToken.id);
                // console.log('data=', data)
                req.user = data;
                // res.status(200).json({ success: true, message: 'successfully fetched one user.', 'data': data })
            }
            catch (error) {
                res.status(500).json({ 'error': error.message })
            }

            // If the user exists, you can attach it to the request object for further use
            // req.user = user;

            // Proceed to the next middleware
            next();
        });

    }
    else {
        return res.status(401).json({ message: "Unauthorized. Token is missing." })
    }
}



exports.AdminAuth = async (req, res, next) => {
    user = req.user
    // console.log('userrrrrrrrr', user)
    if (user.usertype === 'ADMIN') {
        next()
    }
    else {
        return res.status(403).json({ success: false, message: 'Access denied, you do not have permission' })
    }
}