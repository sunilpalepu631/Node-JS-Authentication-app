



let userFilters = (req) => {
    // Extract query parameters from the request
    const { username, first_name, last_name, email } = req.query;

    // Construct a MongoDB query object based on the received parameters
    const query = {};

    if (username) {
        // query.username = /test/i;
        query.username = new RegExp(username, 'i');
        console.log('uerey usernamer', query.username)
    }
    if (first_name) {
        query.username = new RegExp(first_name, 'i');
    }
    if (last_name) {
        query.last_name = new RegExp(last_name, 'i');
    }
    if (email) {
        query.email = new RegExp(email, 'i');
    }

    return query
}

module.exports = userFilters