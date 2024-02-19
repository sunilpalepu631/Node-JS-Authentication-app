const { faker } = require('@faker-js/faker');
const { User, Tasks } = require('../model/userModel');
const bcrypt = require('bcryptjs')



async function fakeData() {
    let data = [];
    const encrypted_password = await bcrypt.hash('Test@123', 10)
    console.log(encrypted_password)
    for (let i = 0; i < 10; i++) {
        let user_data = {
            email: faker.internet.email(),
            password: encrypted_password,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            dob: faker.date.birthdate(),
            address: faker.location.streetAddress(),
            usertype: faker.helpers.arrayElement(['USER', 'ADMIN']),
            age: faker.number.int({ min: 18, max: 60 }),
            phone_number: faker.number.int({ min: 9000000000, max: 9999999999 })
        };
        data.push(user_data);
    }
    return data;
}




async function generateFakeUsersData(req, res) {
    try {
        const data = await fakeData()

        const users = await User.insertMany(data)

        return res.json({ message: 'successfully seeded', count: users.length })

    }
    catch (error) {
        // console.log('error = ', error)
        return res.json({ error: error })
    }
}

async function genereateFakeTasksData(req, res) {
    try {

        let user_details = await User.find().limit(10)
        // console.log(user_details)
        let data = []
        for (let i = 0; i < 10; i++) {
            let task_data = {
                task: faker.lorem.lines(1),
                description: faker.lorem.lines(5),
                user_id: user_details[i].id
            }
            data.push(task_data)

        }
        const tasks = await Tasks.insertMany(data)

        return res.json({ count: tasks.length, message: 'successfully  inserted data', })
        // return res.json({ success: true })
    }
    catch (error) {
        return res.send(error.message)
    }
}






module.exports = { generateFakeUsersData, genereateFakeTasksData }