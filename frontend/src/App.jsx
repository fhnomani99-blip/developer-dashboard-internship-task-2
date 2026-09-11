import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import ProjectCard from "./components/ProjectCard";
import TaskCard from "./components/TaskCard";

import "./App.css";

const projects = [
  {
    name: "Portfolio Website",
    description: "Personal developer portfolio",
    progress: 75,
    status: "In Progress",
  },
  {
    name: "E-Commerce App",
    description: "Online shopping platform",
    progress: 52,
    status: "In Progress",
  },
  {
    name: "Weather App",
    description: "Real-time weather application",
    progress: 100,
    status: "Completed",
  },
  {
    name: "Task Manager",
    description: "Productivity and task management",
    progress: 35,
    status: "In Progress",
  },
];
const tasks = [
  {
    title: "Build portfolio homepage",
    project: "Portfolio Website",
    status: "In Progress",
    priority: "High",
    dueDate: "Aug 25",
  },
  {
    title: "Create product listing",
    project: "E-Commerce App",
    status: "In Progress",
    priority: "Medium",
    dueDate: "Aug 27",
  },
  {
    title: "Connect weather API",
    project: "Weather App",
    status: "Completed",
    priority: "High",
    dueDate: "Aug 20",
  },
  {
    title: "Design task interface",
    project: "Task Manager",
    status: "Pending",
    priority: "Low",
    dueDate: "Aug 30",
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || project.status === filter;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Loading dashboard...</p>
    </div>
  );
}

return (
  <div className="dashboard">

      <Sidebar />

      <main className="main">

        <Header />

        <section className="stats">
          <StatCard title="Total Projects" value="8" />
          <StatCard title="Active Tasks" value="24" />
          <StatCard title="Completed" value="18" />
        </section>

        <section>

          <div className="section-header">
            <h2>Your Projects</h2>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All Projects</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <section className="tasks-section">
  <div className="section-header">
    <div>
      <h2>Your Tasks</h2>
      <p>Stay on top of your development work</p>
    </div>
  </div>

  <div className="tasks">
    {tasks.map((task) => (
      <TaskCard
        key={task.title}
        task={task}
      />
    ))}
  </div>
</section>

          <input
            className="search"
            type="text"
            placeholder="🔍 Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="projects">
            {filteredProjects.length > 0 ? (
  filteredProjects.map((project) => (
    <ProjectCard
      key={project.name}
      project={project}
    />
  ))
) : (
  <div className="empty-state">
    <div className="empty-icon">📂</div>
    <h3>No projects found</h3>
    <p>
      Try changing your search or filter to find a project.
    </p>
  </div>
)}
          </div>

        </section>

      </main>

    </div>
  );
}

export default App;
