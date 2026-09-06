const mongoose = require("mongoose");
const User = require("../models/userModel");

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// CREATE user
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const user = await User.create({
      name,
      email,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};