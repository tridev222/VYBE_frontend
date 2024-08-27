import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Card, CardMedia, Typography, Avatar, IconButton, Modal, Box, TextField
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UserSuggestion from '../components/userSuggestion';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (loading) return;
      setLoading(true);

      try {
        const response = await axios.get('http://localhost:8000/api/v1/posts/random', {
          params: { limit: 10 },
        });

        const newPosts = response.data.posts;
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [loading]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handlePreviousPost = () => {
    const currentIndex = posts.findIndex((post) => post === selectedPost);
    if (currentIndex > 0) {
      setSelectedPost(posts[currentIndex - 1]);
    }
  };

  const handleNextPost = () => {
    const currentIndex = posts.findIndex((post) => post === selectedPost);
    if (currentIndex < posts.length - 1) {
      setSelectedPost(posts[currentIndex + 1]);
    }
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: '16px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2 }}>Posts</Typography>

          <Grid container spacing={2}>
            {posts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => handlePostClick(post)}>
                  <CardMedia component="img" height="250" image={post.imgurl} alt="Post image" />
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
                      <Typography variant="body2">{post.likes.length}</Typography>
                      <CommentIcon fontSize="small" />
                      <Typography variant="body2">{post.comments.length}</Typography>
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

      {selectedPost && (
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
                src={selectedPost?.imgurl}
                alt="Post"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={selectedPost?.user.profilePicture} alt={selectedPost?.user.username} />
                  <Box>
                    <Typography variant="h6">{selectedPost?.user.username}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedPost?.user.name}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ mt: 2 }}>{selectedPost?.description}</Typography>
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
                  {selectedPost?.comments.map((comment, idx) => (
                    <Typography variant="body2" key={idx}>
                      {comment.username}: {comment.text}
                    </Typography>
                  ))}
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
      )}
    </Box>
  );
};

export default Feed;
