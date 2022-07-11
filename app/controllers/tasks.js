const Task = require('../models/Task');
const createPagination = require('../utils/createPagination');
const asyncWrapper = require('../utils/asyncWrapper');
const CustomError = require('../errors/CustomError');
const STATUS_CODES = require('../constants/statusCodes');
const createNumericFiltersMapper = require('../utils/createNumericFiltersMapper');

const mapNumericFilters = createNumericFiltersMapper(['likes']);

const getPagination = createPagination(Task);

const getAllTasks = asyncWrapper(
    async (req, res) => {
        const {
            completed,
            name,
            page,
            limit,
            sort,
        } = req.query;

        const filters = mapNumericFilters(req.query);

        if (completed) {
            filters.completed = completed === 'true';
        }

        if (name) {
            filters.name = {
                $regex: name,
                $options: 'i',
            };
        }

        const sortParams = sort ? sort.split(',').join(' ').trim() : 'createdAt';

        const { skip, ...pagination } = await getPagination({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            ...filters,
        });

        const tasks = await Task.find(
            filters,
            null,
            {
                skip,
                limit: pagination.limit,
                sort: sortParams,
            },
        );

        res.status(STATUS_CODES.SUCCESS).send({
            tasks,
            meta: pagination,
        });
    }
);

const createTask = asyncWrapper( 
    async (req, res) => {
        const task = await Task.create({
            ...req.body,
            createdAt: Date.now(),
        });
        
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
