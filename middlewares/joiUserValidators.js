
// const { userSignupSchema } = require('../model/userModel')

const Joi = require('joi')
const validator = require('validator');


const valid_password_method = (value, helpers) => {
    if (!validator.isStrongPassword(value)) {
        throw new Error('Invalid password')
        // return helpers.error('any.invalid')
    }
    return value
}

// Define Joi schema for User
const userRegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .required()
        .custom(valid_password_method, 'custom password validation')
        .messages({ 'any.custom': 'Invalid Password.It should contain atleast one upper,lower,number and symbol' }),
    confirm_password: Joi.string()
        .required()
        .valid(Joi.ref('password')) // Ensure it matches the 'password' field
        .messages({ 'any.only': 'Passwords do not match' }),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    dob: Joi.date().optional(),
    address: Joi.string().optional(),
    phone_number: Joi.string().length(10).optional(),
    age: Joi.number().integer().min(16).max(100).optional(),
    usertype: Joi.string().valid('USER', 'ADMIN').required()
});


const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})


const updateUserPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .required()
        .custom(valid_password_method, 'custom password validation')
        .messages({ 'any.custom': 'Invalid Password.It should contain atleast one upper,lower,number and symbol' }),
    confirm_password: Joi.string()
        .required()
        .valid(Joi.ref('password')) // Ensure it matches the 'password' field
        .messages({ 'any.only': 'Passwords do not match' })
})


//new
const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {

            return res.status(422).json({ success: false, error: error.details });
        }
        next()
    };
};







// Define Joi schema for Task
const taskAddSchema = Joi.object({
    task: Joi.string().required(),
    description: Joi.string().optional(),
    user_id: Joi.string() // Assuming user_id is a string representing ObjectId
});





module.exports = {
    validationMiddleware,

    updateUserPasswordSchema,
    userRegisterSchema,
    userLoginSchema,
    taskAddSchema

}