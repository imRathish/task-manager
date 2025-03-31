import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper } from '@mui/material';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setUser(data.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          <strong>Name:</strong> {user.name}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body1">
          <strong>Preferences:</strong> {user.preferences}
        </Typography>
      </Paper>
    </Container>
  );
};

export default UserProfile;
