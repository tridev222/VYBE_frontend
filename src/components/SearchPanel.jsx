import React, { useState } from 'react';
import { Drawer, IconButton, Box, TextField, Divider, Typography, Button, CircularProgress } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

const SearchPanel = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followedUsers, setFollowedUsers] = useState(new Set()); // Track followed users

  // Get values from local storage
  const accessToken = localStorage.getItem('accessToken');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/users/search?query=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE')) {
          throw new Error(` ${response.status}Received HTML response instead of JSON. Please check the API endpoint or server: ${response.status}`);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.data || []); // Safeguard in case `data` or `data.data` is undefined
    } catch (error) {
      console.error('Error fetching users:', error);
      setResults([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  };

  const getUserIdByUsername = async (username) => {
    try {
      const response = await fetch(`/api/v1/users/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE')) {
          throw new Error('Received HTML response instead of JSON. Please check the API endpoint or server.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.data._id; // Return the user ID
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const handleFollow = async (username) => {
    try {
      const response = await fetch(`/api/v1/users/${username}/follow`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const userIdToFollow = await getUserIdByUsername(username);
      setFollowedUsers(prev => new Set(prev).add(userIdToFollow)); // Update followed users state
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      const userIdToUnfollow = await getUserIdByUsername(username);
      const response = await fetch(`/api/v1/users/${username}/follow`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setFollowedUsers(prev => {
        const updated = new Set(prev);
        updated.delete(userIdToUnfollow);
        return updated;
      }); // Update followed users state
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 333,
          height: '100%',
          position: 'fixed',
          top: 0,
          left: '5rem',
          backgroundColor: '#fff',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1300,
          border: 'none',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            Search
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', marginBottom: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '1px',
                paddingRight: '2rem',
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  edge="end"
                  sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                  onClick={() => setQuery('')} // Clear search query
                >
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
        <Divider sx={{ marginBottom: '2rem' }} />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : results.length > 0 ? (
          <Box>
            {results.map((user) => (
              <Box key={user._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <img
                  src={user.profilePicture || 'person/noAvatar.png'}
                  alt={user.username}
                  style={{ width: 50, height: 50, marginRight: 10, borderRadius: '50%' }}
                />
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  {user.username}
                </Typography>
                <Button
                  variant="outlined"
                  color={followedUsers.has(user._id) ? 'success' : 'primary'}
                  onClick={() =>
                    followedUsers.has(user._id) ? handleUnfollow(user.username) : handleFollow(user.username)
                  }
                  sx={{
                    color: followedUsers.has(user._id) ? 'lightgrey' : 'inherit',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    textTransform: 'none',
                    minWidth: '80px',
                  }}
                >
                  {followedUsers.has(user._id) ? 'Following' : 'Follow'}
                </Button>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No results
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default SearchPanel;
