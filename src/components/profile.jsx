import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, CardMedia, Modal, Backdrop, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import axios from 'axios';

// Import the default profile image
import defaultProfileImage from '../assets/default_profile.jpg';

const getButtonStyle = () => ({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#a81434',
  borderColor: '#a81434',
  '&:hover': {
    backgroundColor: '#a81434',
    color: 'white',
    borderColor: '#a81434',
  },
  width: '12rem',
});

export default function Profile() {
  const [user, setUser] = useState({
    username: 'Sample User',
    bio: '',
    profilePicture: '', // Updated to match backend field
    followers: 0,
    following: 0,
    posts: [],
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchUserProfile = async () => {
    try {
      const username = localStorage.getItem('username');
      const accessToken = localStorage.getItem('accessToken');

      if (!username || !accessToken) {
        console.error("No username or access token found");
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/v1/users/${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        const userData = response.data.data;
        setUser({
          username: userData.username || 'Sample User',
          bio: userData.description || 'This user has no bio.',
          profilePicture: userData.profilePicture || '', // Updated to match backend field
          followers: userData.followers ? userData.followers.length : 0,
          following: userData.followings ? userData.followings.length : 0,
          posts: userData.posts || [],
        });
      } else {
        console.error("Failed to fetch user data", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    // Set up an interval to refresh followers and following counts every 30 seconds
    const intervalId = setInterval(fetchUserProfile, 30000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <Box sx={{ minHeight: '85vh', backgroundColor: '#fffff', p: 4, ml: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', pb: 4, borderBottom: '1px solid #ccc' }}>
        <Box 
          sx={{ 
            width: 134, // Increased width by 6px
            height: 134, // Increased height by 6px
            borderRadius: '50%', 
            overflow: 'hidden', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={handleOpen}
        >
          <img
            src={user.profilePicture ? user.profilePicture : defaultProfileImage} // Updated to match backend field
            alt={user.username}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center' 
            }} 
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1">{user.username}</Typography>
          <Typography variant="subtitle1" color="textSecondary">@{user.username}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.bio}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon />
            <Typography>{user.followers} Followers</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon />
            <Typography>{user.following} Following</Typography>
          </Box>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/edit-profile"
            sx={getButtonStyle()}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      <Box sx={{ pt: 4 }}>
        <Typography variant="h5" component="h2">Posts</Typography>
        <Grid container spacing={4} sx={{ pt: 2 }}>
          {user.posts.length > 0 ? (
            user.posts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{
                    padding: '16px', // Add some padding to make the card slightly larger
                    height: '100%', // Ensure cards have consistent height
                    boxShadow: 3, // Add a slight shadow for emphasis
                  }}
                >
                  <CardMedia
                    component="img"
                    height="210" // Increase the image height slightly (was 200)
                    image={post.image || '/placeholder.svg'}
                    alt={`Post ${index + 1}`}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <FavoriteIcon fontSize="small" />
                      <Typography>{post.likes || 0} Likes</Typography>
                      <CommentIcon fontSize="small" />
                      <Typography>{post.comments || 0} Comments</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography 
              sx={{ 
                textAlign: 'center', 
                width: '100%', 
                color: 'grey', 
                fontWeight: 'bold', 
                mt: 4 
              }}
            >
              No posts yet.
            </Typography>
          )}
        </Grid>
      </Box>

      {/* Modal for the enlarged image */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: '10px',
              outline: 'none',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={user.profilePicture ? user.profilePicture : defaultProfileImage} // Updated to match backend field
              alt={user.username}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
