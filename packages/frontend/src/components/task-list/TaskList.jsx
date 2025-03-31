import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TaskForm from '../task-form/TaskForm';
import { fetchTasks, fetchUsers } from '../../apiUtils';
import './TaskList.scss';

// Mapping for task status colors
const STATUS_COLORS = {
  'pending': '#E2E3E5',
  'in-progress': '#E6F3FF',
  'completed': '#DAFBE1',
  'closed': '#FFE6E6',
};

// Mapping for subtle modern priority pill styles
const PRIORITY_COLOR_STYLES = {
  high: { background: '#FFCDD2', color: '#C62828' },
  medium: { background: '#FFE0B2', color: '#EF6C00' },
  low: { background: '#BBDEFB', color: '#1565C0' },
};

const TaskList = () => {
  // State to store tasks, user mapping, and modal visibility
  const [tasks, setTasks] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch tasks and users when the component mounts
  useEffect(() => {
    // Asynchronously load tasks and user data
    const loadData = async () => {
      try {
        // Fetch tasks from the API
        const tasksData = await fetchTasks();
        setTasks(tasksData);

        // Fetch users and create a mapping (id -> name)
        const usersData = await fetchUsers();
        const map = {};
        usersData.forEach((u) => {
          map[u.id] = u.name;
        });
        setUsersMap(map);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Render a status pill with the corresponding background color
  const renderStatusPill = (status) => {
    const color = STATUS_COLORS[status?.toLowerCase()] || '#E2E3E5';
    return (
      <span className="task-list__status-pill" style={{ backgroundColor: color }}>
        {status || 'N/A'}
      </span>
    );
  };

  // Render a priority pill with modern styling based on the task priority
  const renderPriorityPill = (priority) => {
    const style = PRIORITY_COLOR_STYLES[priority?.toLowerCase()] || {
      background: '#ccc',
      color: '#fff',
    };
    return (
      <span
        className="task-list__priority-pill"
        style={{ backgroundColor: style.background, color: style.color }}
      >
        {priority || 'N/A'}
      </span>
    );
  };

  // Open the create task modal
  const handleOpenCreate = () => setShowCreateModal(true);
  // Close the create task modal
  const handleCloseCreate = () => setShowCreateModal(false);
  // After creating a task, refresh the task list and close the modal
  const handleTaskCreated = () => {
    handleCloseCreate();
    // Re-fetch tasks to update the list
    fetchTasks().then((tasksData) => setTasks(tasksData));
  };

  return (
    <div className="task-list">
      {/* Header section with title and button */}
      <div className="task-list__header">
        <h3>All Tasks</h3>
        <button className="task-list__create-btn" onClick={handleOpenCreate}>
          Create
        </button>
      </div>

      {/* Table wrapper for displaying tasks */}
      <div className="task-list__table-wrapper">
        <table className="task-list__table">
          <thead>
            <tr>
              <th className="task-list__id-col">Key</th>
              <th className="task-list__title-col">Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="task-list__no-tasks-row">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                // Lookup the assignee's name, defaulting to 'Unassigned' if missing
                const assigneeName = usersMap[task.assigned_to] || 'Unassigned';
                return (
                  <tr key={task.id}>
                    <td className="task-list__id-col">
                      <Link to={`/task/${task.id}`} className="task-list__key-link">
                        TASK-{task.id}
                      </Link>
                    </td>
                    <td className="task-list__title-col">{task.title}</td>
                    <td>{renderPriorityPill(task.priority)}</td>
                    <td>{renderStatusPill(task.status)}</td>
                    <td>{assigneeName}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for creating a new task */}
      {showCreateModal && (
        <div className="task-list__modal-overlay" onClick={handleCloseCreate}>
          <div className="task-list__modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="task-list__modal-header">
              <h2>Create Task</h2>
              <button className="task-list__close-btn" onClick={handleCloseCreate}>
                &times;
              </button>
            </div>
            {/* Render TaskForm for creating a new task */}
            <TaskForm onSuccess={handleTaskCreated} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
