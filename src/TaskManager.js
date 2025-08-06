import React, { useState, useEffect } from 'react';
import './App.css';



const TaskManager = () => {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', id: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.id) {
      setTasks(tasks.map(t => t.id === form.id ? { ...form, complete: t.complete } : t));
    } else {
      setTasks([...tasks, { ...form, id: crypto.randomUUID(), complete: false }]);
    }
    setForm({ title: '', description: '', priority: 'medium', dueDate: '', id: '' });
    setIsEditing(false);
  };

  const handleToggle = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, complete: !task.complete } : task));
  };

  const handleEdit = (task) => {
    setForm(task);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filters.status === 'all' || (filters.status === 'complete' ? task.complete : !task.complete);
    const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="container">
      <header>
        <h1>Task Manager</h1>
        <p>Organize your tasks efficiently</p>
        <img src="reminder.png" alt="Logo" width="120" />
      </header>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input id="title" value={form.title} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" value={form.description} onChange={handleInputChange} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" value={form.priority} onChange={handleInputChange} required>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input type="date" id="dueDate" value={form.dueDate} onChange={handleInputChange} />
          </div>
        </div>
        <button className="btn btn-primary" type="submit">{isEditing ? 'Update Task' : 'Add Task'}</button>
      </form>

      <div className="filters">
        <div className="filter-group">
          <label>Status</label>
          <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="all">All</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Priority</label>
          <select value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })}>
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">No tasks found matching your filters</div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-item ${task.complete ? 'task-complete' : ''}`}>
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-actions">
                  <button className="btn btn-success" onClick={() => handleToggle(task.id)}>
                    {task.complete ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button className="btn btn-primary" onClick={() => handleEdit(task)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </div>
              <div className="task-description">{task.description || 'No description provided'}</div>
              <div className="task-meta">
                <span className={`task-priority priority-${task.priority}`}>{task.priority.toUpperCase()}</span>
                <span>Due: {task.dueDate || 'No due date'}</span>
                <span className={`task-status ${task.complete ? 'status-complete' : 'status-incomplete'}`}>
                  {task.complete ? 'COMPLETE' : 'INCOMPLETE'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
