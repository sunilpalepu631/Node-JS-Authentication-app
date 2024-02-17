// user models

const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    first_name: { type: String, index: true },
    last_name: { type: String, index: true },
    dob: { type: Date },
    address: { type: String },
    phone_number: { type: String, unique: true },
    age: { type: Number },
    usertype: {
        type: String,
        enum: ['USER', 'ADMIN'],
        required: true
    }
}, { timestamps: true });



const TaskSchema = mongoose.Schema({
    task: { type: String, unique: true },
    description: { type: String, required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true }
}, { timestamps: true })


UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', UserSchema);
const Tasks = mongoose.model('Tasks', TaskSchema)



module.exports = { User, Tasks };


