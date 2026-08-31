let tasks = [];

const validStatuses = ["todo", "in-progress", "done"];
const validPriorities = ["low", "medium", "high"];

const getTasks = (req, res) => {
    res.status(200).json(tasks);
};

const createTask = (req, res) => {
    const {
        title,
        description,
        status,
        priority,
        dueDate,
        projectId,
        userId
    } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            error: "Title and description are required"
        });
    }

    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
            error: "Status must be todo, in-progress, or done"
        });
    }

    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({
            error: "Priority must be low, medium, or high"
        });
    }

    const task = {
        id: tasks.length + 1,
        title,
        description,
        status: status || "todo",
        priority: priority || "medium",
        dueDate: dueDate || null,
        projectId: projectId || null,
        userId: userId || null
    };

    tasks.push(task);

    res.status(201).json(task);
};

const getTaskById = (req, res) => {
    const id = parseInt(req.params.id);

    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.status(200).json(task);
};

const updateTask = (req, res) => {
    const id = parseInt(req.params.id);

    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const {
        title,
        description,
        status,
        priority,
        dueDate,
        projectId,
        userId
    } = req.body;

    if (status !== undefined && !validStatuses.includes(status)) {
        return res.status(400).json({
            error: "Status must be todo, in-progress, or done"
        });
    }

    if (priority !== undefined && !validPriorities.includes(priority)) {
        return res.status(400).json({
            error: "Priority must be low, medium, or high"
        });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (projectId !== undefined) task.projectId = projectId;
    if (userId !== undefined) task.userId = userId;

    res.status(200).json(task);
};

const deleteTask = (req, res) => {
    const id = parseInt(req.params.id);

    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1);

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });
};

module.exports = {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
};