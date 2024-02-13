// user models

const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    first_name: String,
    last_name: String,
    email: { type: String, required: true }
}, { timestamps: true }
);

const User = mongoose.model('customers', UserSchema);
module.exports = User;


