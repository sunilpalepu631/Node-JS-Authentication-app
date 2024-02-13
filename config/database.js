// database.js
const mongoose = require('mongoose')
require('dotenv').config();

const mongodbUri = process.env.MONGODB_URI
console.log(mongodbUri);

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connectDB = async () => mongoose.connect(mongodbUri, connectionParams)
    .then(() => {
        console.log('Connected to the database. ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. ${err}`);
    })

module.exports = connectDB;

// const Mongoose = require("mongoose")`
// const localDB = `mongodb://localhost:27017/role_auth``
// const connectDB = async () => {
//     await Mongoose.connect(localDB, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     console.log("MongoDB Connected")
// }
// module.exports = connectDB