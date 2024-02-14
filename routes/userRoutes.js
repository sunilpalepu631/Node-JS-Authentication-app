const express = require('express')
const router = express.Router()
const userController = require('../controllers/userControllers');
const { BasicAuth } = require('../auth');
const { validate, passwordValidate } = require('../middlewares/userValidators')

// router.post('/register', regiter)
router.route('/register').post(validate, userController.register);
router.route('/login').post(userController.login);
router.route('/forgetpassword').post(userController.forgetPassword);
router.route('/updatepassword').get(passwordValidate, userController.updatePassword);

router.route('/getall').get(BasicAuth, userController.getAllUsers);
router.route('/getprofile').get(BasicAuth, userController.getProfile);
// router.route('/getoneuser').get(BasicAuth, userController.getUserById);

router.route('/update/:id').put(BasicAuth, userController.updateUser)
router.route('/delete/:id').delete(BasicAuth, userController.deleteUser)



module.exports = router

