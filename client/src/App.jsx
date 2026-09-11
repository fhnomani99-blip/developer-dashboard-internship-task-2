import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api";

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState(user ? "dashboard" : "login");

  if (!user) {
    return (
      <Auth
        mode={page}
        onLogin={(data) => {
          const u = data.user || data;
          localStorage.setItem("user", JSON.stringify(u));
          if (data.token) localStorage.setItem("token", data.token);
          setUser(u);
          setPage("dashboard");
        }}
        onModeChange={setPage}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setPage("login");
      }}
    />
  );
}

/* ================= AUTH ================= */

function Auth({ mode, onLogin, onModeChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!email || !password || (mode === "register" && !name)) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "login" ? "/auth/login" : "/auth/register";

      const body =
        mode === "login"
          ? { email, password }
          : { name, email, password };

      const res = await fetch(API + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message || "Authentication failed");
        return;
      }

      onLogin(data);
    } catch (err) {
      alert("Cannot connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">🚀 TaskFlow AI</div>
        <p className="subtitle">
          AI-Powered Project & Task Management
        </p>

        <h1>{mode === "login" ? "Welcome Back" : "Create Account"}</h1>

        <form onSubmit={submit}>
          {mode === "register" && (
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p className="switch">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            className="link-btn"
            onClick={() =>
              onModeChange(mode === "login" ? "register" : "login")
            }
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function Dashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [taskDueDate, setTaskDueDate] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const userId = user?._id || user?.id;

  async function loadData() {
    try {
      const [pRes, tRes] = await Promise.all([
        fetch(API + "/projects"),
        fetch(API + "/tasks"),
      ]);

      const pData = await pRes.json();
      const tData = await tRes.json();

      setProjects(Array.isArray(pData) ? pData : pData.projects || []);
      setTasks(Array.isArray(tData) ? tData : tData.tasks || []);
    } catch {
      console.log("Could not load data");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  /* ---------- PROJECT ---------- */

  async function createProject(e) {
    e.preventDefault();

    if (!projectName.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      const res = await fetch(API + "/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token")
            ? {
                Authorization:
                  "Bearer " + localStorage.getItem("token"),
              }
            : {}),
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message || "Project creation failed");
        return;
      }

      alert("Project created successfully!");
      setProjectName("");
      setProjectDescription("");
      loadData();
    } catch {
      alert("Server connection error");
    }
  }

  async function deleteProject(id) {
    if (!confirm("Delete this project?")) return;

    try {
      const res = await fetch(API + "/projects/" + id, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Could not delete project");
        return;
      }

      loadData();
    } catch {
      alert("Server connection error");
    }
  }

  /* ---------- TASK ---------- */

  async function createTask(e) {
    e.preventDefault();

    if (!taskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    if (!taskProject) {
      alert("Please select a project");
      return;
    }

    try {
      const res = await fetch(API + "/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskTitle,
          name: taskTitle,
          description: taskDescription,
          projectId: taskProject,
          userId,
          priority: taskPriority,
          status: taskStatus,
          dueDate: taskDueDate || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message || "Task creation failed");
        return;
      }

      alert("Task created successfully!");

      setTaskTitle("");
      setTaskDescription("");
      setTaskProject("");
      setTaskPriority("medium");
      setTaskStatus("todo");
      setTaskDueDate("");

      loadData();
    } catch {
      alert("Server connection error");
    }
  }

  async function updateTask(id, status) {
    try {
      const res = await fetch(API + "/tasks/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        alert("Could not update task");
        return;
      }

      loadData();
    } catch {
      alert("Server connection error");
    }
  }

  async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    try {
      const res = await fetch(API + "/tasks/" + id, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Could not delete task");
        return;
      }

      loadData();
    } catch {
      alert("Server connection error");
    }
  }

  /* ---------- AI FEATURE ---------- */

  function generateAIPlan() {
    const title = taskTitle.trim();

    if (!title) {
      alert("Enter a task title first.");
      return;
    }

    const lower = title.toLowerCase();

    let suggestion;

    if (
      lower.includes("login") ||
      lower.includes("auth") ||
      lower.includes("security")
    ) {
      suggestion =
        "AI Suggestion:\n1. Design authentication flow\n2. Validate user credentials\n3. Add protected routes\n4. Test login/logout\n5. Handle authentication errors";
    } else if (
      lower.includes("website") ||
      lower.includes("frontend") ||
      lower.includes("ui")
    ) {
      suggestion =
        "AI Suggestion:\n1. Create page structure\n2. Build reusable components\n3. Add responsive styling\n4. Connect API\n5. Test user interactions";
    } else if (
      lower.includes("database") ||
      lower.includes("backend") ||
      lower.includes("api")
    ) {
      suggestion =
        "AI Suggestion:\n1. Design data model\n2. Create API endpoint\n3. Add validation\n4. Connect database\n5. Test CRUD operations";
    } else {
      suggestion =
        "AI Suggestion:\n1. Break the task into smaller steps\n2. Define the expected result\n3. Implement the core functionality\n4. Test the implementation\n5. Review and complete the task";
    }

    alert(suggestion);
  }

  /* ---------- FILTER ---------- */

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const title = (task.title || task.name || "").toLowerCase();

      const matchesSearch = title.includes(search.toLowerCase());

      const status = task.status || "todo";
      const matchesFilter =
        filter === "all" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const completed = tasks.filter(
    (t) => t.status === "done" || t.status === "completed"
  ).length;

  const progress =
    tasks.length > 0
      ? Math.round((completed / tasks.length) * 100)
      : 0;

  return (
    <div className="app">
      {/* NAVBAR */}

      <nav className="navbar">
        <div>
          <strong>🚀 TaskFlow AI</strong>
          <span>Project Management Platform</span>
        </div>

        <div className="nav-right">
          <span>👤 {user.name || user.email}</span>
          <button className="logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="container">
        <div className="page-heading">
          <div>
            <h1>Project Dashboard</h1>
            <p>Manage your projects and tasks efficiently.</p>
          </div>
        </div>

        {/* STATS */}

        <div className="stats">
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <strong>{projects.length}</strong>
            <span>Total Projects</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <strong>{tasks.length}</strong>
            <span>Total Tasks</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <strong>{completed}</strong>
            <span>Completed</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <strong>{progress}%</strong>
            <span>Progress</span>
          </div>
        </div>

        {/* CREATE FORMS */}

        <div className="forms">
          <section className="panel">
            <h2>➕ Create Project</h2>

            <form onSubmit={createProject}>
              <input
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <textarea
                placeholder="Project description"
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(e.target.value)
                }
              />

              <button>Create Project</button>
            </form>
          </section>

          <section className="panel">
            <h2>📝 Create Task</h2>

            <form onSubmit={createTask}>
              <input
                placeholder="Task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />

              <textarea
                placeholder="Task description"
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(e.target.value)
                }
              />

              <select
                value={taskProject}
                onChange={(e) => setTaskProject(e.target.value)}
              >
                <option value="">Select Project</option>

                {projects.map((project) => (
                  <option
                    key={project._id}
                    value={project._id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={taskPriority}
                onChange={(e) =>
                  setTaskPriority(e.target.value)
                }
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <select
                value={taskStatus}
                onChange={(e) =>
                  setTaskStatus(e.target.value)
                }
              >
                <option value="todo">To Do</option>
                <option value="in-progress">
                  In Progress
                </option>
                <option value="done">Done</option>
              </select>

              <input
                type="date"
                value={taskDueDate}
                onChange={(e) =>
                  setTaskDueDate(e.target.value)
                }
              />

              <div className="button-row">
                <button type="submit">Create Task</button>

                <button
                  type="button"
                  className="ai-button"
                  onClick={generateAIPlan}
                >
                  🤖 AI Suggest
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* PROJECTS */}

        <section className="panel">
          <h2>📁 Projects</h2>

          {projects.length === 0 ? (
            <p className="empty">No projects yet.</p>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <div className="project-card" key={project._id}>
                  <h3>{project.name}</h3>

                  <p>
                    {project.description ||
                      "No description provided."}
                  </p>

                  <button
                    className="danger"
                    onClick={() =>
                      deleteProject(project._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* TASKS */}

        <section className="panel">
          <div className="task-header">
            <h2>📋 Tasks</h2>

            <div className="filters">
              <input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="in-progress">
                  In Progress
                </option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="empty">No tasks found.</p>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div className="task-card" key={task._id}>
                  <div>
                    <h3>{task.title || task.name}</h3>

                    <p>
                      {task.description ||
                        "No description provided."}
                    </p>

                    <div className="badges">
                      <span>
                        Priority:{" "}
                        {task.priority || "medium"}
                      </span>

                      <span>
                        Status: {task.status || "todo"}
                      </span>

                      {task.dueDate && (
                        <span>
                          Due:{" "}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="task-actions">
                    <select
                      value={task.status || "todo"}
                      onChange={(e) =>
                        updateTask(
                          task._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">
                        In Progress
                      </option>
                      <option value="done">Done</option>
                    </select>

                    <button
                      className="danger"
                      onClick={() =>
                        deleteTask(task._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RECENT ACTIVITY */}

        <section className="panel">
          <h2>🕒 Recent Activity</h2>

          <div className="activity">
            <div>📁 Projects: {projects.length}</div>
            <div>📋 Tasks: {tasks.length}</div>
            <div>✅ Completed: {completed}</div>
            <div>📊 Overall Progress: {progress}%</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;