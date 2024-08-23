import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Divider, Link, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

// Default placeholder avatar URL
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIj4KICA8Y2lyY2xlIGN4PSI3MCIgY3k9IjcwIiByPSI3MCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtY29sb3I9InJnYmEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==';
const accessToken = localStorage.getItem('accessToken');
const username = localStorage.getItem('username');

const UserSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [followedUsers, setFollowedUsers] = useState(new Set()); // Track followed users

  const fetchFollowedUsers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/${username}/following`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const followedUserIds = new Set(data.following.map(user => user._id));
      setFollowedUsers(followedUserIds);
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/suggest/random', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setSuggestions(data.data);
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
    }
  };

  useEffect(() => {
    fetchFollowedUsers();
    fetchSuggestions();
  }, []);

  const getUserIdByUsername = async (username) => {
    try {
      const response = await fetch(`/api/v1/users/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
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
      return data.data._id;
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const handleFollow = async (username) => {
    try {
      const userIdToFollow = await getUserIdByUsername(username);
      if (!userIdToFollow) return;

      const response = await fetch(`/api/v1/users/${username}/follow`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setFollowedUsers(prev => new Set(prev).add(userIdToFollow));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      const userIdToUnfollow = await getUserIdByUsername(username);
      if (!userIdToUnfollow) return;

      const response = await fetch(`/api/v1/users/${username}/unfollow`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setFollowedUsers(prev => {
        const updated = new Set(prev);
        updated.delete(userIdToUnfollow);
        return updated;
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <Box sx={{ width: 300, padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h6">Suggested for you</Typography>
        <IconButton onClick={() => {
          fetchSuggestions();
          fetchFollowedUsers();
        }}>
          <RefreshIcon />
        </IconButton>
      </Box>

      <List>
        {suggestions.map(user => (
          <ListItem key={user._id} sx={{ paddingY: 1 }}>
            <ListItemAvatar>
              <Avatar 
                src={user.profilePicture || 'person/noAvatar.png'} 
                alt={user.username} 
                onError={(e) => e.currentTarget.src = defaultAvatar}
              />
            </ListItemAvatar>
            <ListItemText primary={user.username} secondary={user.recommendation} />
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
          </ListItem>
        ))}
      </List>

      <Divider sx={{ marginY: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Link href="#" variant="caption" underline="hover" sx={{ color: 'grey.600' }}>About</Link>
        <Link href="#" variant="caption" underline="hover" sx={{ color: 'grey.600' }}>Help</Link>
        <Link href="#" variant="caption" underline="hover" sx={{ color: 'grey.600' }}>Press</Link>
        <Link href="#" variant="caption" underline="hover" sx={{ color: 'grey.600' }}>API</Link>
        <Link href="#" variant="caption" underline="hover" sx={{ color: 'grey.600' }}>Jobs</Link>
        <Link href="#" variant="caption" underline="hover" sx={{ color: 'grey.600' }}>Privacy</Link>
        <Link href="#" variant="caption" underline="hover" sx={{ color: 'grey.600' }}>Terms</Link>
        <Link href="#" variant="caption" underline="hover" sx={{ color: 'grey.600' }}>Locations</Link>
        <Link href="#" variant="caption" underline="hover" sx={{ color: 'grey.600' }}>Language</Link>
        <Link href="#" variant="caption" underline="hover" sx={{ color: 'grey.600' }}>Meta Verified</Link>
      </Box>

      <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center', marginTop: 2 }}>
        © 2024 Instagram from Meta
      </Typography>
    </Box>
  );
};

export default UserSuggestions;
