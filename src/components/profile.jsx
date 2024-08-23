import React from 'react';
import { Avatar, Box, Button, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';

const getButtonStyle = () => ({
    fontSize: '1rem', // Keep the default font size
    fontWeight: 'bold',
    color: '#a81434', // Light ruby color for text and border
    borderColor: '#a81434', // Light ruby color for the border
    '&:hover': {
      backgroundColor: '#a81434', // Ruby color on hover
      color: 'white', // White text on hover
      borderColor: '#a81434', // Border stays the same color
    },
    width: '12rem', // Same width as before
  });

export default function Profile() {
  return (
    <Box sx={{ minHeight: '85vh', backgroundColor: '#fffff', p: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', pb: 4, borderBottom: '1px solid #ccc' }}>
        <Avatar 
          sx={{ width: 128, height: 128 }} 
          src="/placeholder-user.jpg" 
          alt="John Doe"
        >
          JD
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1">Sample User</Typography>
          <Typography variant="subtitle1" color="textSecondary">@Sample</Typography>
          <Typography variant="body2" color="textSecondary">
            hello this is the test bio this is how the bio will turn out
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon />
            <Typography>100 Followers</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon />
            <Typography>25 Following</Typography>
          </Box>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/edit-profile"
            sx={getButtonStyle()} // Apply custom style
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      <Box sx={{ pt: 4 }}>
        <Typography variant="h5" component="h2">Posts</Typography>
        <Grid container spacing={4} sx={{ pt: 2 }}>
          {['100', '80', '120'].map((likes, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image="/placeholder.svg"
                  alt={`Post ${index + 1}`}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FavoriteIcon fontSize="small" />
                    <Typography>{likes} Likes</Typography>
                    <CommentIcon fontSize="small" />
                    <Typography>{index * 10 + 25} Comments</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
