const createPagination = (model) => async (page = 1, pageSize = 10, filters = {}) => {
    let pageNum = Math.abs(parseInt(page));
    pageNum = pageNum || 1;

    let pageSizeNum = Math.abs(parseInt(pageSize));
    pageSizeNum = pageSizeNum || 1;

    const totalRecords = await model.where(filters).countDocuments();

    const totalPages = Math.ceil(totalRecords / pageSizeNum);

    const skip = (pageNum - 1) * pageSizeNum;

    const nextPage = pageNum < totalPages ? pageNum + 1 : null;

    const prevPage = pageNum <= 1 ? null : pageNum - 1;

    return {
        page: pageNum,
        nextPage,
        prevPage, 
        pageSize: pageSizeNum,
        totalRecords,
        totalPages,
        skip,
    };
};

module.exports = createPagination;
