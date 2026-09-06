const express = require("express");

const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// GET all users
router.get("/", getUsers);

// GET user by ID
router.get("/:id", getUserById);

// CREATE user
router.post("/", createUser);

// UPDATE user
router.put("/:id", updateUser);

// DELETE user
router.delete("/:id", deleteUser);

module.exports = router;