import React, { useState } from 'react';
import {
  Grid, Card, CardMedia, Typography, Avatar, IconButton, Modal, Box, TextField, Menu, MenuItem
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterListIcon from '@mui/icons-material/FilterList';
import UserSuggestion from '../components/userSuggestion'; // Importing the prebuilt UserSuggestion component

// Sample posts data
const postsData = [
  {
    image: '/placeholder.svg',
    likes: 10,
    comments: 5,
    caption: 'This is a caption for the post.',
    author: {
      name: 'Acme Inc',
      username: '@acmeinc',
    },
  },
  {
    image: '/placeholder.svg',
    likes: 15,
    comments: 8,
    caption: 'Another post caption.',
    author: {
      name: 'Globex Corp',
      username: '@globexcorp',
    },
  },
  {
    image: '/placeholder.svg',
    likes: 20,
    comments: 12,
    caption: 'Sharing a beautiful sunset.',
    author: {
      name: 'Stark Industries',
      username: '@starkindustries',
    },
  },
  {
    image: '/placeholder.svg',
    likes: 8,
    comments: 3,
    caption: 'Enjoying the outdoors.',
    author: {
      name: 'Umbrella Corp',
      username: '@umbrellacorp',
    },
  },
  {
    image: '/placeholder.svg',
    likes: 18,
    comments: 7,
    caption: 'Delicious food for the day.',
    author: {
      name: 'Cyberdyne Systems',
      username: '@cyberdyne',
    },
  },
  {
    image: '/placeholder.svg',
    likes: 25,
    comments: 15,
    caption: 'Exploring a new city.',
    author: {
      name: 'Weyland-Yutani',
      username: '@weylandyutani',
    },
  },
  {
    image: '/placeholder.svg',
    likes: 30,
    comments: 20,
    caption: 'Amazing architecture!',
    author: {
      name: 'Initech',
      username: '@initech',
    },
  },
];

const Feed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handlePreviousPost = () => {
    const currentIndex = postsData.findIndex((post) => post === selectedPost);
    if (currentIndex > 0) {
      setSelectedPost(postsData[currentIndex - 1]);
    }
  };

  const handleNextPost = () => {
    const currentIndex = postsData.findIndex((post) => post === selectedPost);
    if (currentIndex < postsData.length - 1) {
      setSelectedPost(postsData[currentIndex + 1]);
    }
  };

  // Handle filter menu open/close
  const handleFilterMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle filter selection (for demonstration purposes)
  const handleFilterByTime = () => {
    // Implement filtering logic by time here
    handleFilterMenuClose();
  };

  const handleFilterByName = () => {
    // Implement filtering logic by name here
    handleFilterMenuClose();
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: '16px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Posts</Typography>
            <IconButton onClick={handleFilterMenuOpen}>
              <FilterListIcon sx={{ color: '#E0115F' }} /> {/* Ruby color */}
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterMenuClose}>
              <MenuItem onClick={handleFilterByTime}>By Time</MenuItem>
              <MenuItem onClick={handleFilterByName}>By Poster Name</MenuItem>
            </Menu>
          </Box>

          <Grid container spacing={2}>
            {postsData.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => handlePostClick(post)}>
                  <CardMedia component="img" height="250" image={post.image} alt="Post image" />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      bgcolor: 'rgba(0, 0, 0, 0.25)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease-in-out',
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <Box sx={{ position: 'absolute', bottom: 8, right: 8, color: 'white', display: 'flex', gap: 1 }}>
                      <FavoriteIcon fontSize="small" />
                      <Typography variant="body2">{post.likes}</Typography>
                      <CommentIcon fontSize="small" />
                      <Typography variant="body2">{post.comments}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4} sx={{ position: 'sticky', top: '16px' }}>
          <UserSuggestion />
        </Grid>
      </Grid>

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
            <img
              src={selectedPost?.image}
              alt="Post"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src="/placeholder-user.jpg" alt={selectedPost?.author.username} />
                <Box>
                  <Typography variant="h6">{selectedPost?.author.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedPost?.author.username}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ mt: 2 }}>{selectedPost?.caption}</Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton>
                  <FavoriteIcon />
                </IconButton>
                <IconButton>
                  <CommentIcon />
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">john: Wow, this photo is absolutely stunning! 😍✨</Typography>
                <Typography variant="body2">amelia: This post just made my day! 😃👍</Typography>
                <Typography variant="body2">emily: I love the composition of this image!</Typography>
              </Box>
              <TextField
                placeholder="Add a comment..."
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                InputProps={{
                  sx: {
                    borderRadius: '16px',
                  },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }}>
            <IconButton onClick={handlePreviousPost}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
          <Box sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>
            <IconButton onClick={handleNextPost}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Feed;
