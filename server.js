// server.js

require('dotenv').config();
const express = require('express')
const app = express()


const PORT = process.env.PORT
const connectDB = require('./config/database')

const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')
const { generateFakeUsersData, genereateFakeTasksData } = require('./helpers/faker')
// conneting to database
connectDB();

app.use(express.json())

app.use('/users/', userRoutes)
app.use('/tasks/', taskRoutes)
app.use('/seed-users', generateFakeUsersData)
app.use('/seed-tasks', genereateFakeTasksData)

app.set('view engine', 'ejs')




app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`))