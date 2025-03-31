import React, { useState, useEffect } from 'react';
import { fetchUsers, createTask, updateTask } from '../../apiUtils';
import './TaskForm.scss';

const TaskForm = ({ onSuccess, initialTask }) => {
  // Set up initial form state (using initialTask values if editing)
  const [title, setTitle] = useState(initialTask ? initialTask.title : '');
  const [description, setDescription] = useState(initialTask ? initialTask.description : '');
  const [deadline, setDeadline] = useState(initialTask ? initialTask.deadline : '');
  const [priority, setPriority] = useState(initialTask ? initialTask.priority : 'Medium');
  const [assignedTo, setAssignedTo] = useState(initialTask ? initialTask.assigned_to : '0');
  const [users, setUsers] = useState([]);

  // Load users for the assignee dropdown when the component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Error loading users:', err);
      }
    };
    loadUsers();
  }, []);

  // Update form fields if the initialTask prop changes (for editing purposes)
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setDeadline(initialTask.deadline);
      setPriority(initialTask.priority);
      setAssignedTo(initialTask.assigned_to ? initialTask.assigned_to : '0');
    } else {
      // Reset the form if no initial task is provided
      setTitle('');
      setDescription('');
      setDeadline('');
      setPriority('Medium');
      setAssignedTo('0');
    }
  }, [initialTask]);

  // Handle form submission for creating or updating a task
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert "0" to an empty string for an unassigned task
    const assigneeValue = assignedTo === '0' ? '' : assignedTo;
    const taskData = {
      title,
      description,
      deadline,
      priority,
      assigned_to: assigneeValue,
    };

    try {
      if (initialTask) {
        // Update an existing task
        await updateTask(initialTask.id, taskData);
      } else {
        // Create a new task
        await createTask(taskData);
      }
      // If the API call is successful, trigger the onSuccess callback (if provided)
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error submitting the task form:', err);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        <div>
          Title<span className="required">*</span>
        </div>
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        <div>
          Description<span className="required">*</span>
        </div>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      
      {/* Row for Deadline, Priority, and Assignee */}
      <div className="form-row">
        <label className="half">
          <div>
            Deadline<span className="required">*</span>
          </div>
          <input 
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </label>
        <label className="half">
          <div>
            Priority<span className="required">*</span>
          </div>
          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label className="half">
          <div>
            Assignee<span className="required">*</span>
          </div>
          <select 
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          >
            <option value="0">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.id})
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit">{initialTask ? 'Update Task' : 'Create Task'}</button>
    </form>
  );
};

export default TaskForm;
