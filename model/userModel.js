// user models

const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');


const UserSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    first_name: { type: String, index: true },
    last_name: { type: String, index: true },
    email: { type: String, unique: true, required: true }
}, { timestamps: true }
);


UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('customers', UserSchema);



// myModel.paginate().then({}); // Usage


module.exports = User;


