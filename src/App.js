// App.js
import React, { useState } from 'react';
import Tasks from './Tasks';
import './App.css';  // Import the CSS file

function App() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState('');
  const [date, setDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasksArray, setTasksArray] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://gemini-api-backend.onrender.com/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, tasks, date }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate tasks');
      }

      const result = await response.json();
      setTasksArray(result.tasks);
      setErrorMessage('');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('There was an error generating the tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadICS = async () => {
    try {
      const response = await fetch('https://gemini-api-backend.onrender.com/download-ics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: tasksArray }),
      });

      if (!response.ok) {
        throw new Error('Failed to download ICS file');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);

      // Trigger a click event on the link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tasks.ics';
      a.click();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h1>Task Scheduler</h1>

      <div className={`form-tasks-container ${tasksArray.length === 0 ? 'no-tasks' : ''}`}>
        {/* Form Section */}
        <form className="form-section" onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <label htmlFor="tasks">Tasks:</label>
          <textarea
            id="tasks"
            name="tasks"
            rows="5"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            required
          ></textarea>

          <label htmlFor="date">Deadline (YYYY-MM-DD):</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Tasks'}
          </button>
        </form>

        {/* Tasks Section */}
        {tasksArray.length > 0 && (
          <div className="tasks-section-container">
            <Tasks tasks={tasksArray} />
          </div>
        )}

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>

      {/* Download ICS Button */}
      {tasksArray.length > 0 && (
        <button
          className="download-button"
          onClick={handleDownloadICS}
        >
          Download ICS File
        </button>
      )}
    </div>
  );
}

export default App;
