export const API_BASE_URL = 'https://task-manager-ltxe.onrender.com/api';

/**
 * Fetch all tasks from the API.
 * @returns {Promise<Array>} - Array of tasks.
 */
export const fetchTasks = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Error fetching tasks:', err);
    throw err;
  }
};

/**
 * Fetch all users from the API.
 * @returns {Promise<Array>} - Array of users.
 */
export const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/users`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
};

/**
 * Create a new task.
 * @param {Object} taskData - Data for the new task.
 * @returns {Promise<Object>} - The created task.
 */
export const createTask = async (taskData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    return await res.json();
  } catch (err) {
    console.error('Error creating task:', err);
    throw err;
  }
};

/**
 * Update an existing task.
 * @param {number|string} taskId - ID of the task to update.
 * @param {Object} taskData - Updated data for the task.
 * @returns {Promise<Object>} - The updated task.
 */
export const updateTask = async (taskId, taskData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    return await res.json();
  } catch (err) {
    console.error(`Error updating task with ID ${taskId}:`, err);
    throw err;
  }
};

/**
 * Fetch a single task's details by its ID.
 * @param {number|string} taskId - The ID of the task.
 * @returns {Promise<Object>} - The task detail object.
 */
export const fetchTaskDetail = async (taskId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(`Error fetching task with ID ${taskId}:`, err);
    throw err;
  }
};

/**
 * Fetch comments for a given task.
 * @param {number|string} taskId - The ID of the task.
 * @returns {Promise<Array>} - Array of comments.
 */
export const fetchTaskComments = async (taskId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error(`Error fetching comments for task ${taskId}:`, err);
    throw err;
  }
};

/**
 * Create a comment for a given task.
 * @param {number|string} taskId - The ID of the task.
 * @param {Object} commentData - Data for the new comment.
 * @returns {Promise<Object>} - The created comment.
 */
export const createTaskComment = async (taskId, commentData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    });
    return await res.json();
  } catch (err) {
    console.error(`Error creating comment for task ${taskId}:`, err);
    throw err;
  }
};
