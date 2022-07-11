const createPagination = (model) => async (
    {
        page,
        limit,
        ...filters
    } = {},
) => {
    const totalRecords = await model.where(filters).countDocuments();

    const totalPages = Math.ceil(totalRecords / limit);

    const skip = (page - 1) * limit;

    const nextPage = page < totalPages ? page + 1 : null;

    const prevPage = page <= 1 ? null : page - 1;

    return {
        page,
        nextPage,
        prevPage, 
        limit,
        totalRecords,
        totalPages,
        skip,
    };
};

module.exports = createPagination;
