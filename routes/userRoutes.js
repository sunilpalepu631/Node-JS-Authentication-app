/*
user routes
*/

const express = require('express')
const router = express.Router()
const userController = require('../controllers/user_controllers');
const { BasicAuth, AdminAuth } = require('../middlewares/auth');
const { validationMiddleware, userRegisterSchema, userLoginSchema, updateUserPasswordSchema, } = require('../middlewares/joiUserValidators');




router.post('/register', validationMiddleware(userRegisterSchema), userController.register)
router.post('/login', validationMiddleware(userLoginSchema), userController.login);

router.post('/forgetpassword', userController.forgetPassword);
router.post('/updatepassword', validationMiddleware(updateUserPasswordSchema), userController.updatePassword);

router.get('/', BasicAuth, AdminAuth, userController.getAllUsers);
router.get('/getone/:id', BasicAuth, AdminAuth, userController.getOneUser);
router.get('/getprofile', BasicAuth, userController.getProfile);

router.put('/:id', BasicAuth, userController.updateUser)
router.delete('/:id', BasicAuth, userController.deleteUser)


module.exports = router

