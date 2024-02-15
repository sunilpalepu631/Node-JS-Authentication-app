const { Tasks } = require('../model/userModel')


const addTask = async (req, res, next) => {
    let user_id;
    if (req.user.usertype === 'USER') {
        user_id = req.user.id
    }
    else if (req.user.usertype === 'ADMIN') {
        user_id = req.body.user_id
    }


    const { task, description } = req.body

    await Tasks.create({
        task,
        description,
        user_id
    }).then(data => {
        res.status(201).json({ success: true, message: 'Task added successfully', data: data })
    }).catch(error => {
        res.status(500).json({ success: false, error: error.message })
    })

}



const getAllTasks = async (req, res, next) => {
    try {
        let filter = {}

        if (req.user.usertype === 'USER') {
            filter = { user_id: req.user.id }
        }
        // else if (req.user.usertype === 'ADMIN') {
        //     filter = {}
        // }
        const tasks = await Tasks.find(filter)
        return res.status(200).json({ success: true, message: 'Successfully fetched all tasks', data: tasks })
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
}


// const getMyTasks = async (req, res, next) => {
//     try {
//         user_id = req.user.id

//         console.log('user_id', user_id)

//         const tasks = await Tasks.find({ user_id: user_id })
//         res.status(200).json({ success: true, message: 'Successfully fetched all tasks', data: tasks })
//     }
//     catch (error) {
//         res.status(500).json({ success: false, error: error })
//     }
// }







module.exports = { addTask, getAllTasks }