

function paginate(data, page, limit, count) {

    const next_page = parseInt(page) + 1;
    const next_page_exists = next_page <= Math.ceil(count / limit);

    const previous_page = parseInt(page) - 1;
    const previous_page_exists = previous_page <= Math.ceil(count / limit)

    const response = {
        count: count,
        total_pages: Math.ceil(count / limit),
        current_page: parseInt(page),
        results_per_page: limit,
        next_page: next_page_exists ? next_page : null,
        previous_page: previous_page_exists ? previous_page : null,
        data: data
    }
    return response
}

module.exports = paginate