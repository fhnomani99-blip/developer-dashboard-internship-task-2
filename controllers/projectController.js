let projects = [];

const getProjects = (req, res) => {
    res.json(projects);
};

const getProjectById = (req, res) => {
    const id = parseInt(req.params.id);

    const project = projects.find((p) => p.id === id);

    if (!project) {
        return res.status(404).json({
            error: "Project not found"
        });
    }

    res.json(project);
};

const createProject = (req, res) => {
    const { name, description, userId } = req.body;

    if (!name || !description || !userId) {
        return res.status(400).json({
            error: "Name, description and userId are required"
        });
    }

    const project = {
        id: projects.length + 1,
        name,
        description,
        userId
    };

    projects.push(project);

    res.status(201).json(project);
};
const updateProject = (req, res) => {
    const id = parseInt(req.params.id);

    const project = projects.find((p) => p.id === id);

    if (!project) {
        return res.status(404).json({
            error: "Project not found"
        });
    }

    const { name, description, userId } = req.body;

    if (!name || !description || !userId) {
        return res.status(400).json({
            error: "Name, description and userId are required"
        });
    }

    project.name = name;
    project.description = description;
    project.userId = userId;

    res.json(project);
};
const deleteProject = (req, res) => {
    const id = parseInt(req.params.id);

    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Project not found"
        });
    }

    const deletedProject = projects.splice(index, 1);

    res.json({
        message: "Project deleted successfully",
        project: deletedProject[0]
    });
};
module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};