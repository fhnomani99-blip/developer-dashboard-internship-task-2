function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>

      <p>{project.description}</p>

      <div className="progress-info">
        <span>{project.status}</span>
        <strong>{project.progress}%</strong>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${project.progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProjectCard;