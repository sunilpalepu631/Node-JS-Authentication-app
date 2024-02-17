// server.js

const express = require('express')
const app = express()
require('dotenv').config();

const PORT = process.env.PORT

const connectDB = require('./config/database')

// const dotenv = require('dotenv')
// dotenv.config()


// conneting to database
connectDB();


app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`))
app.use(express.json())
app.use('/user/', require('./routes/userRoutes'))
app.use('/task/', require('./routes/taskRoutes'))

