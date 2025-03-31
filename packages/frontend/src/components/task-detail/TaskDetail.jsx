import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchTaskDetail,
  fetchTaskComments,
  fetchUsers,
  updateTask,
  createTaskComment,
} from '../../apiUtils';
import './TaskDetail.scss';

const TaskDetail = ({ currentUser }) => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateMsg, setUpdateMsg] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [users, setUsers] = useState([]);

  // Load task details, comments, and users when the component mounts or when the task ID changes.
  useEffect(() => {
    const loadData = async () => {
      try {
        const taskData = await fetchTaskDetail(id);
        setTask(taskData);

        const commentsData = await fetchTaskComments(id);
        // Sort comments so that the newest appear first.
        const sortedComments = (commentsData || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setComments(sortedComments);

        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Error loading task details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Get the user's name based on their ID; falls back gracefully.
  const getUserName = (userId) => {
    const user = users.find((u) => u.id.toString() === userId.toString());
    return user ? user.name : `User ${userId}`;
  };

  // Update the task in the backend whenever a field changes.
  const handleUpdateTask = async (updatedTask) => {
    setUpdateMsg('');
    try {
      await updateTask(id, updatedTask);
      setUpdateMsg('Changes saved!');
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // When a field loses focus, save any changes.
  const handleBlur = () => {
    if (task) {
      handleUpdateTask(task);
    }
  };

  // Handle changes from select inputs and update the task immediately.
  const handleSelectChange = (field, value) => {
    const updated = { ...task, [field]: value };
    setTask(updated);
    handleUpdateTask(updated);
  };

  // Handle submission of a new comment.
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    const commentData = {
      user_id: currentUser.id,
      comment: newComment,
    };
    try {
      await createTaskComment(id, commentData);
      setNewComment('');
      // Refresh comments after posting.
      const updatedComments = await fetchTaskComments(id);
      const sorted = (updatedComments || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setComments(sorted);
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  if (loading) return <div className="task-detail__loading">Loading...</div>;
  if (!task) return <div className="task-detail__not-found">Task not found</div>;

  return (
    <div className="task-detail">
      <div className="task-detail__nav">
        <Link to="/" className="task-detail__back-link">
          &larr; Back to Task List
        </Link>
      </div>

      <div className="task-detail__main">
        <div className="task-detail__left">
          <h4 className="task-detail__title">{task.title}</h4>

          {/* Task Description Section */}
          <div className="task-detail__section">
            <h4 className="task-detail__section-title">Description</h4>
            <textarea
              className="task-detail__textarea"
              value={task.description || ''}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              onBlur={handleBlur}
              placeholder="Enter task description..."
            />
          </div>

          {/* Comments Section */}
          <div className="task-detail__section task-detail__comments-section">
            <h4 className="task-detail__section-title">Comments</h4>

            {/* New Comment Form */}
            <div className="task-detail__new-comment-box">
              <form
                className="task-detail__comment-form"
                onSubmit={handleCommentSubmit}
              >
                <textarea
                  className="task-detail__new-comment-input"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button type="submit" className="task-detail__add-comment-btn">
                  Post
                </button>
              </form>
            </div>

            {/* Existing Comments List */}
            {comments.length === 0 ? (
              <p className="task-detail__no-comments">No comments yet.</p>
            ) : (
              <ul className="task-detail__comments-list">
                {comments.map((c) => {
                  // Format the comment's creation date and time.
                  const isoString = c?.created_at?.replace(' ', 'T') + 'Z';
                  const dateObj = new Date(isoString || '');
                  const dateString = dateObj.toLocaleDateString([], {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                  const timeString = dateObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  });
                  return (
                    <li key={c.id} className="task-detail__comment-item">
                      <div className="task-detail__comment-header">
                        <div className="task-detail__comment-author">
                          {getUserName(c.user_id)}
                        </div>
                        <div className="task-detail__comment-time">
                          {dateString} at {timeString}
                        </div>
                      </div>
                      <div className="task-detail__comment-body">
                        {c.comment}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Task Details */}
        <div className="task-detail__right">
          <div className="task-detail__details-card">
            <h4 className="task-detail__details-title">Details</h4>
            <form
              className="task-detail__details-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="task-detail__details-label">
                <span>Status:</span>
                <select
                  value={task.status || ''}
                  onChange={(e) =>
                    handleSelectChange('status', e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
              <label className="task-detail__details-label">
                <span>Priority:</span>
                <select
                  value={task.priority || ''}
                  onChange={(e) =>
                    handleSelectChange('priority', e.target.value)
                  }
                >
                  <option value="">Select priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>
              <label className="task-detail__details-label">
                <span>Deadline:</span>
                <input
                  type="date"
                  value={task.deadline || ''}
                  onChange={(e) =>
                    setTask({ ...task, deadline: e.target.value })
                  }
                  onBlur={handleBlur}
                />
              </label>
              <label className="task-detail__details-label">
                <span>Assignee:</span>
                <select
                  value={task.assigned_to || ''}
                  onChange={(e) =>
                    handleSelectChange('assigned_to', e.target.value)
                  }
                  onBlur={handleBlur}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.id})
                    </option>
                  ))}
                </select>
              </label>
              {updateMsg && (
                <div className="task-detail__update-msg">{updateMsg}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
