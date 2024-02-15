// user models

const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');


const UserSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    first_name: { type: String, index: true },
    last_name: { type: String, index: true },
    email: { type: String, unique: true, required: true },
    usertype: {
        type: String,
        enum: ['USER', 'ADMIN'],
        required: true
    }
}, { timestamps: true }
);

const TaskSchema = mongoose.Schema({
    task: { type: String, required: true },
    description: { type: String, required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', index: true, required: true }
})


UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('customers', UserSchema);
const Tasks = mongoose.model('Tasks', TaskSchema)



module.exports = { User, Tasks };


