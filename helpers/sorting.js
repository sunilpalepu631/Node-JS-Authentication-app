
// sort by "field" ascending and "test" descending
// query.sort({ username: 'asc' });

let userSorting = (req) => {
    const { sortBy = '_id', sortType = 'desc' } = req.query

    let query_sort = {}

    if (sortBy) {
        query_sort[sortBy] = sortType || 'desc'
    }
    // else {
    //     query_sort._id = 'desc'
    // }

    // console.log('query sort', query_sort)

    return query_sort
}




module.exports = userSorting