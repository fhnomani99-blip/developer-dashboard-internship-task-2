const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// User CRUD
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;