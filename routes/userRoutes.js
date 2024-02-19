/*
user routes
*/

const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user_controllers');
const { BasicAuth, AdminAuth } = require('../middlewares/auth');
const { validationMiddleware, userRegisterSchema, userLoginSchema, updateUserPasswordSchema, } = require('../middlewares/joiUserValidators');



router.post('/register', validationMiddleware(userRegisterSchema), UserController.register)
router.post('/login', validationMiddleware(userLoginSchema), UserController.login);

router.post('/forgetpassword', UserController.forgetPassword);
router.post('/updatepassword', validationMiddleware(updateUserPasswordSchema), UserController.updatePassword);

router.get('/', BasicAuth, AdminAuth, UserController.getAllUsers);
router.get('/getone/:id', BasicAuth, AdminAuth, UserController.getOneUser);
router.get('/profile', BasicAuth, UserController.getProfile);

router.put('/:id', BasicAuth, UserController.updateUser)
router.delete('/:id', BasicAuth, UserController.deleteUser)


module.exports = router

