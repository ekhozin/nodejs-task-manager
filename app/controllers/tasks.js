const Task = require('../models/Task');
const createPagination = require('../utils/createPagination');
const asyncWrapper = require('../utils/asyncWrapper');
const CustomError = require('../errors/CustomError');
const STATUS_CODES = require('../constants/statusCodes');

const getPagination = createPagination(Task);

const getAllTasks = asyncWrapper(
    async (req, res) => {
        const {
            filters = {},
            page,
            pageSize,
        } = req.query;

        const { skip, ...pagination } = await getPagination(page, pageSize, filters);

        const tasks = await Task.find(filters, null, { skip, limit: pagination.pageSize });

        res.status(STATUS_CODES.SUCCESS).send({
            tasks,
            meta: pagination,
        });
    }
);

const createTask = asyncWrapper( 
    async (req, res) => {
        const task = await Task.create(req.body);
        
        res.status(STATUS_CODES.CREATED).json({ task });
    }
);

const getTask = asyncWrapper(
    async (req, res, next) => {
        const { id: taskId } = req.params;
        const task = await Task.findById(taskId);

        if (!task) {
            return next(
                new CustomError(
                    `Task ${taskId} does not exist`,
                    STATUS_CODES.NOT_FOUND,
                ),
            );
        }

        res.status(STATUS_CODES.SUCCESS).json({ task });
    }
);

const updateTask = asyncWrapper(
    async (req, res) => {
        const { id: taskId } = req.params;
        const task = await Task.findByIdAndUpdate(
            taskId,
            req.body,
            {
                new: true,
                runValidators: true,
            },
        );

        if (!task) {
            return next(
                new CustomError(
                    `Task ${taskId} does not exist`,
                    STATUS_CODES.NOT_FOUND,
                ),
            );
        }

        res.status(STATUS_CODES.SUCCESS).json({ task });
    }
);

const deleteTask = asyncWrapper(
    async (req, res, next) => {
        const { id: taskId } = req.params;
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return next(
                new CustomError(
                    `Task ${taskId} does not exist`,
                    STATUS_CODES.NOT_FOUND,
                ),
            );
        }

        res.status(STATUS_CODES.SUCCESS).send();
    }
);

module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
};
