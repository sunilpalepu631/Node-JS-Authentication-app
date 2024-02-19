



const userFilters = (filters) => {
    // Extract query parameters from the request
    const { email, first_name, last_name } = filters;

    // Construct a MongoDB query object based on the received parameters
    let query = {};

    if (email) {
        query.email = new RegExp(email, 'i');
    }
    if (first_name) {
        query.first_name = new RegExp(first_name, 'i');
    }
    if (last_name) {
        query.last_name = new RegExp(last_name, 'i');
    }

    return query
}





const taskFilters = (req) => {

    const filter = {}

    if (req.user.usertype === 'USER') {
        filter.user_id = req.user.id
    }
    if (req.query.title) {
        filter.title = req.query.title
    }
    if (req.query.user_id) {
        filter.user_id = req.query.user_id
    }

    return filter
}




module.exports = { userFilters, taskFilters }
