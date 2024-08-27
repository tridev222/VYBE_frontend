import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Divider, Link, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIj4KICA8Y2lyY2xlIGN4PSI3MCIgY3k9IjcwIiByPSI3MCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtY29sb3I9InJnYmEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==';
const accessToken = localStorage.getItem('accessToken');

const UserSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // Fetch the logged-in user's ID using the access token
  const fetchLoggedInUserId = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLoggedInUserId(response.data.user._id);
    } catch (error) {
      console.error('Error fetching logged-in user ID:', error);
    }
  }, []);

  const fetchFollowedUsers = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/users/${loggedInUserId}/following`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const followedUserIds = new Set(response.data.following.map(user => user._id));
      setFollowedUsers(followedUserIds);
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  }, [loggedInUserId]);

  const fetchProfilePicture = useCallback(async (username) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/users/${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data.profilePicture || defaultAvatar;
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      return defaultAvatar;
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/users/suggest/random', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Filter out the logged-in user based on ID
      const filteredSuggestions = response.data.data.filter(user => user._id !== loggedInUserId);

      // Fetch profile pictures for each user
      const usersWithProfilePics = await Promise.all(
        filteredSuggestions.map(async (user) => {
          const profilePicture = await fetchProfilePicture(user.username);
          return { ...user, profilePicture };
        })
      );

      setSuggestions(usersWithProfilePics);
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
    }
  }, [loggedInUserId, fetchProfilePicture]);

  const handleFollow = async (username) => {
    try {
      const userIdToFollow = await getUserIdByUsername(username);
      if (!userIdToFollow) return;

      await axios.put(`/api/v1/users/${username}/follow`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setFollowedUsers(prev => new Set(prev).add(userIdToFollow));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      const userIdToUnfollow = await getUserIdByUsername(username);
      if (!userIdToUnfollow) return;

      await axios.put(`/api/v1/users/${username}/unfollow`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setFollowedUsers(prev => {
        const updated = new Set(prev);
        updated.delete(userIdToUnfollow);
        return updated;
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const getUserIdByUsername = useCallback(async (username) => {
    try {
      const response = await axios.get(`/api/v1/users/${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.data._id;
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  }, []);

  useEffect(() => {
    fetchLoggedInUserId();
  }, [fetchLoggedInUserId]);

  useEffect(() => {
    if (loggedInUserId) {
      fetchFollowedUsers();
      fetchSuggestions();
    }
  }, [loggedInUserId, fetchFollowedUsers, fetchSuggestions]);

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
      </Box>

      <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center', marginTop: 2 }}>
        © 2024 VYBE
      </Typography>
    </Box>
  );
};

export default UserSuggestions;
