function TaskCard({ task }) {
  return (
    <div className="task-card">
      <div className="task-main">
        <div>
          <h3>{task.title}</h3>
          <p>{task.project}</p>
        </div>

        <span className={`task-status ${task.status.toLowerCase().replace(" ", "-")}`}>
          {task.status}
        </span>
      </div>

      <div className="task-bottom">
        <span>Due: {task.dueDate}</span>
        <span className={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;