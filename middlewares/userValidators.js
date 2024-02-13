
const validator = require('validator');


function validate(req, res, next) {

    const { username, password, email, first_name, last_name } = req.body

    const isPasswordValid = validator.isStrongPassword(password)

    const isEmailValid = validator.isEmail(email)

    console.log('ispassword valid', isPasswordValid)
    console.log('isemail valid', isEmailValid)

    let errors = {}
    if (!validator.isStrongPassword(password)) {
        errors['password'] = ['Password must contain atleast one uppercase,lowercase,number,special_character']

    }
    if (!validator.isEmail(email)) {
        errors['email'] = ['Enter valid email ID']
    }
    console.log(Object.keys(errors).length);

    if (Object.keys(errors).length !== 0) {
        return res.status(422).json({ error: errors });
    }
    next()

}

module.exports = validate
