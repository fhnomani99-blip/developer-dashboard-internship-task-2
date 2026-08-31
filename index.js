const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Developer Dashboard API is running"
  });
});

const PORT = process.env.PORT || 5000;
// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});