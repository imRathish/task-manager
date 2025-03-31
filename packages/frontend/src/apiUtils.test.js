import {
    fetchTasks,
    fetchUsers,
    createTask,
    updateTask,
    fetchTaskDetail,
    fetchTaskComments,
    createTaskComment,
    API_BASE_URL
  } from './apiUtils';
  
  describe('API Utilities', () => {
    // Reset mocks before each test.
    beforeEach(() => {
      global.fetch = jest.fn();
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    test('fetchTasks returns tasks array', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1' }];
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ data: mockTasks }),
      });
  
      const tasks = await fetchTasks();
      expect(tasks).toEqual(mockTasks);
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/tasks`);
    });
  
    test('fetchUsers returns users array', async () => {
      const mockUsers = [{ id: 1, name: 'User 1' }];
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ data: mockUsers }),
      });
  
      const users = await fetchUsers();
      expect(users).toEqual(mockUsers);
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/users`);
    });
  
    test('createTask sends POST request and returns response', async () => {
      const taskData = { title: 'New Task' };
      const mockResponse = { data: { id: 2, ...taskData } };
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });
  
      const response = await createTask(taskData);
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
    });
  
    test('updateTask sends PUT request and returns response', async () => {
      const taskId = 1;
      const taskData = { title: 'Updated Task' };
      const mockResponse = { data: { id: taskId, ...taskData } };
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });
  
      const response = await updateTask(taskId, taskData);
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
    });
  
    test('fetchTaskDetail returns task detail', async () => {
      const taskId = 1;
      const mockTask = { id: taskId, title: 'Task 1' };
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ data: mockTask }),
      });
  
      const task = await fetchTaskDetail(taskId);
      expect(task).toEqual(mockTask);
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/tasks/${taskId}`);
    });
  
    test('fetchTaskComments returns comments array', async () => {
      const taskId = 1;
      const mockComments = [{ id: 101, comment: 'Nice task!' }];
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ data: mockComments }),
      });
  
      const comments = await fetchTaskComments(taskId);
      expect(comments).toEqual(mockComments);
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/tasks/${taskId}/comments`);
    });
  
    test('createTaskComment sends POST request and returns response', async () => {
      const taskId = 1;
      const commentData = { comment: 'New Comment', user_id: 1 };
      const mockResponse = { data: { id: 201, ...commentData } };
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });
  
      const response = await createTaskComment(taskId, commentData);
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });
    });
  });
  