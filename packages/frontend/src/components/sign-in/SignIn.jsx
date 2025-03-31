import React, { useEffect, useState } from 'react';
import './SignIn.scss';
import { fetchUsers } from '../../apiUtils'; // Import our shared API helper

const SignIn = ({ onSignIn }) => {
  // Local state to store the list of users and the currently selected user ID.
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    // Fetch the users list when the component mounts.
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    loadUsers();
  }, []);

  // Handle form submission by finding the selected user and passing it to onSignIn.
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.id.toString() === selectedUserId);
    if (user) {
      onSignIn(user);
    }
  };

  return (
    <div className="sign-in">
      <div className="sign-in__container">
        <h2 className="sign-in__title">Sign In</h2>
        <form onSubmit={handleSubmit} className="sign-in__form">
          <label className="sign-in__label">
            Select User:
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
              className="sign-in__select"
            >
              <option value="">--Select a user--</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.id})
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="sign-in__button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
