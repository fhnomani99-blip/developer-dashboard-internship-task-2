const Task = require("../models/taskModel");

// GET all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("projectId")
            .populate("userId");

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// GET task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("projectId")
            .populate("userId");

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// CREATE task
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            projectId,
            userId
        } = req.body;

        if (!title || !projectId || !userId) {
            return res.status(400).json({
                error: "Title, projectId and userId are required"
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            projectId,
            userId
        });

        res.status(201).json(task);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// UPDATE task
const updateTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            projectId,
            userId
        } = req.body;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                status,
                priority,
                projectId,
                userId
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// DELETE task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};