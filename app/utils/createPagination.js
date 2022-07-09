const createPagination = (model) => async (
    {
        page = 1,
        pageSize = 10,
        ...filters
    } = {},
) => {
    const totalRecords = await model.where(filters).countDocuments();

    const totalPages = Math.ceil(totalRecords / pageSize);

    const skip = (page - 1) * pageSize;

    const nextPage = page < totalPages ? page + 1 : null;

    const prevPage = page <= 1 ? null : page - 1;

    return {
        page,
        nextPage,
        prevPage, 
        pageSize,
        totalRecords,
        totalPages,
        skip,
    };
};

module.exports = createPagination;
