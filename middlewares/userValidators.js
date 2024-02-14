
const validator = require('validator');


function validate(req, res, next) {

    const { username, password, email, first_name, last_name } = req.body


    let errors = {}
    if (!validator.isStrongPassword(password)) {
        errors['password'] = ['Password must contain atleast one uppercase,lowercase,number,special_character']

    }
    if (!validator.isEmail(email)) {
        errors['email'] = ['Enter valid email ID']
    }
    // console.log(Object.keys(errors).length);

    if (Object.keys(errors).length !== 0) {
        return res.status(422).json({ error: errors });
    }
    next()

}


function passwordValidate(req, res, next) {

    // const { password } = req.body
    const password = req.body.password

    const isPasswordValid = validator.isStrongPassword(password)

    let errors = {}

    if (!validator.isStrongPassword(password)) {
        errors['password'] = ['Password must contain atleast one uppercase,lowercase,number,special_character and min length 8.']
        return res.status(422).json({ error: errors });
    }

    next()

}

module.exports = {
    validate,
    passwordValidate
}
