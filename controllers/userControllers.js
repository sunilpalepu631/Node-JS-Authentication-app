// userControllers

const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();
// const validator = require('validator');
const jwtSecret = process.env.JWT_SECRET_KEY
console.log(jwtSecret);

const sendMail = require('../helpers/nodemailer')



// register user api
register = async (req, res, next) => {

    const { username, password, email, first_name, last_name } = req.body

    // hashing password
    bcrypt.hash(password, 10).then(async (hash) => {

        await User.create({
            username,
            password: hash,
            email,
            first_name,
            last_name,
        })
            .then(user => {

                res.status(201).json({
                    message: 'User succcessfully created',
                    user: user,
                });
            })
            .catch((err) =>
                res.status(400).json({
                    message: 'User not successful created',
                    error: err.message,
                })

            );
    })

}



// User login api
login = async (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            error: "Username or password not present",
        })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) {
            res.status(401).json({
                message: 'login not successful',
                error: 'User not found',
            })
        } else {
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id, username },
                        jwtSecret,
                        {
                            expiresIn: maxAge, // 3hrs in sec
                        }
                    );
                    // res.cookie("jwt", token, {
                    //     httpOnly: true,
                    //     maxAge: maxAge * 1000, // 3hrs in ms
                    // });
                    res.status(201).json({
                        message: "User successfully Logged in",
                        token: token,
                        user: user,
                    });
                } else {
                    res.status(400).json({ message: "Login not succesful" });
                }
            });
        }
    } catch (error) {
        res.status(400).json({
            message: 'An error occured',
            error: error.message
        })
    }
}


// get all api
getAllUsers = async (req, res, next) => {
    try {
        const data = await User.find();//{}, { password: 0 }
        res.status(200).json({ success: true, message: 'Successfully fetched all users', data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};





// get one api
getProfile = async (req, res) => {
    try {
        data = req.user//data getting from middle ware
        res.status(200).json({ success: true, message: 'successfully fetched one user.', 'data': data })
    }
    catch (error) {
        res.status(500).json({ 'error': error.message })
    }
}





// need to implement update user details  api
// update api
updateUser = async (req, res) => {
    try {
        const user_id = req.user.id;

        // console.log('user_id = ', user_id)zzzzz

        const given_id = req.params.id

        if (given_id !== user_id) {
            return res.status(403).json({ success: false, error: "you can not update other person details" })
        }
        const updatedData = req.body;
        const options = { new: true };

        const result = await User.findByIdAndUpdate(
            user_id, updatedData, options
        )
        res.status(200).json({ success: true, messge: 'Successfully updated user details', 'data': result })
    }
    catch (error) {
        res.status(400).json({ success: false, 'error': error.message })
    }
}


updatePassword = async (req, res, next) => {
    try {

        let email = req.body.email;
        let password = req.body.password;
        let confirm_password = req.body.confirm_password;
        if (!email || !password || confirm_password) return res.status(422).json({ success: false, error: 'Email,password and confirm password is required' })
        // Check if passwords match
        if (password !== confirm_password) {
            return res.status(400).json({ success: false, error: 'Password and confirm password should match' });
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: 'Email not found' });
        }

        // Hash the new password
        const hash = await bcrypt.hash(password, 10);

        // Update user password
        user.password = hash;
        await user.save();

        return res.status(200).json({ success: true, message: 'Successfully updated the password' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


forgetPassword = async (req, res, next) => {
    try {
        let email = req.body.email

        user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, error: 'Email not found' })
        }


        const hostName = req.hostname;
        const port = process.env.PORT

        const message = `http://${hostName}:${port}/user/updatepassword`

        response = await sendMail(email, message)
        return res.status(200).json({ success: true, message: 'Email sent successful', response: response })
    }
    catch (error) {
        return res.status(404).json({ success: false, error: 'email not found' })
    }



}


// Delete api
deleteUser = async (req, res) => {
    try {
        const user_id = req.user.id;
        const given_id = req.params.id


        console.log(given_id === user_id)

        if (given_id !== user_id) {
            return res.status(403).json({ success: false, error: "you can not delete other user" })
        }
        const data = await User.findByIdAndDelete(given_id)
        if (!data) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: `Document with ${data.first_name} has been deleted...` })
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

// deleteUser = async (req, res, next) => {
//     const { id } = req.body
//     await User.findById(id)
//       .then(user => user.remove())
//       .then(user =>
//         res.status(201).json({ message: "User successfully deleted", user })
//       )
//       .catch(error =>
//         res
//           .status(400)
//           .json({ message: "An error occurred", error: error.message })
//       )
//   }


module.exports = {
    register,
    login,
    updateUser,
    deleteUser,
    getProfile,
    getAllUsers,
    forgetPassword,
    updatePassword
}


