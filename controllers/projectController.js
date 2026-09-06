const Project = require("../models/projectModel");

// GET all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("userId");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("userId");

    if (!project) {
      return res.status(404).json({
        error: "Project not found"
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE project
const createProject = async (req, res) => {
  try {
    const { name, description, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({
        error: "Name and userId are required"
      });
    }

    const project = await Project.create({
      name,
      description,
      userId
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE project
const updateProject = async (req, res) => {
  try {
    const { name, description, userId } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        userId
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        error: "Project not found"
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        error: "Project not found"
      });
    }

    res.status(200).json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};