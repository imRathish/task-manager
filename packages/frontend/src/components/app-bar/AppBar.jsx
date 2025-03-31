import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AppBar.scss';

const AppBar = ({ currentUser, onSignOut }) => {
  const navigate = useNavigate();

  // Handles user sign out by clearing session storage, calling a callback,
  // navigating back to home, and reloading the page.
  const handleSignOut = () => {
    sessionStorage.removeItem('currentUser');
    if (onSignOut) onSignOut();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="appbar">
      <div className="appbar__left">Task Manager</div>
      <div className="appbar__right">
        <span className="appbar__user-name">{`Hi ${currentUser.name}`}</span>
        <button className="appbar__signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default AppBar;
