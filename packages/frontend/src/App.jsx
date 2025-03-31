// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppBar from './components/app-bar/AppBar';
import TaskList from './components/task-list/TaskList';
import TaskDetail from './components/task-detail/TaskDetail';
import SignIn from './components/sign-in/SignIn';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      {currentUser ? (
        <>
          <AppBar currentUser={currentUser} onSignOut={handleSignOut} />
          <Routes>
            <Route path="/" element={<TaskList currentUser={currentUser} />} />
            <Route path="/task/:id" element={<TaskDetail currentUser={currentUser} />} />
          </Routes>
        </>
      ) : (
        <SignIn onSignIn={(user) => setCurrentUser(user)} />
      )}
    </Router>
  );
}

export default App;
