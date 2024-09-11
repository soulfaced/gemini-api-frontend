// Tasks.js
import React from 'react';
import './Tasks.css';

const Tasks = ({ tasks, onDownload }) => {
  return (
    <div className="tasks-container">
      <h2>Tasks</h2>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <div className="tooltip-container">
              <strong className="task-title">{task.Task}</strong>
              <div className="tooltip">{task.Task}</div>
            </div>
            <p>Due Date: {task.Due_Date}</p>
            <p>Due Time: {task.Due_Time}</p>
          </li>
        ))}
      </ul>
      <button className="download-button" onClick={onDownload}>Download ICS</button>
    </div>
  );
};

export default Tasks;
