import React, { useState } from 'react';
import { 
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';

const posts = [
  {
    id: 1,
    user: { name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40' },
    content: { src: '/placeholder.svg?height=400&width=400' },
    caption: "Beautiful day at the beach! 🏖️ #SummerVibes",
    likes: 42,
    comments: [
      { user: 'Alice', text: 'Looks amazing!' },
      { user: 'Bob', text: 'Wish I was there!' }
    ],
  },
  {
    id: 2,
    user: { name: 'Jane Smith', avatar: '/placeholder.svg?height=40&width=40' },
    content: { src: '/placeholder.svg?height=400&width=400' },
    caption: "Just finished this amazing book! 📚 #MustRead",
    likes: 28,
    comments: [
      { user: 'Charlie', text: 'What book is it?' },
      { user: 'David', text: 'I love that author!' }
    ],
  },
  {
    id: 3,
    user: { name: 'Bob Johnson', avatar: '/placeholder.svg?height=40&width=40' },
    content: { src: '/placeholder.svg?height=400&width=400' },
    caption: "Delicious homemade pasta for dinner 🍝 #FoodLover",
    likes: 35,
    comments: [
      { user: 'Eve', text: 'Recipe please!' },
      { user: 'Frank', text: 'Looks delicious!' }
    ],
  },
];

export default function Home() {
  const [expandedPost, setExpandedPost] = useState(null);

  const handleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
      {posts.map((post) => (
        <Card 
          key={post.id} 
          sx={{ 
            marginBottom: 4, // Space between cards
            overflow: 'hidden',
            transition: 'all 0.5s ease-in-out', // Synchronized smooth transition
            maxWidth: expandedPost === post.id ? 1200 : 600, // Expand card width equally on both sides
            marginLeft: expandedPost === post.id ? '-25%' : 'auto', // Adjust position to maintain centering
            marginRight: expandedPost === post.id ? '-25%' : 'auto', // Adjust position to maintain centering
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              width: '100%',
              transition: 'all 0.5s ease-in-out', // Synchronized smooth transition
            }}
          >
            <Box 
              sx={{ 
                width: expandedPost === post.id ? '50%' : '100%', // Adjust width when expanded
                flexShrink: 0,
                transition: 'all 0.5s ease-in-out', // Synchronized smooth transition
              }}
            >
              <CardHeader
                avatar={
                  <Avatar src={post.user.avatar} aria-label={post.user.name}>
                    {post.user.name.charAt(0)}
                  </Avatar>
                }
                title={post.user.name}
                sx={{ pb: 1 }}
              />
              <CardMedia
                component="img"
                height={400}
                image={post.content.src}
                alt="Post content"
              />
              <CardContent sx={{ pt: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <IconButton aria-label="like" size="small">
                    <FavoriteIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2" sx={{ mr: 2 }}>{post.likes}</Typography>
                  <IconButton 
                    aria-label="comment" 
                    size="small" 
                    onClick={() => handleExpandPost(post.id)}
                  >
                    <ChatBubbleOutlineIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">{post.comments.length}</Typography>
                </Box>
                <Typography variant="body2">{post.caption}</Typography>
              </CardContent>
            </Box>
            {expandedPost === post.id && (
              <Box 
                sx={{ 
                  width: '50%', // Fixed width to take up the remaining space
                  height: '100%',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.5s ease-in-out', // Synchronized smooth transition
                }}
              >
                <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {post.likes} likes • {post.comments.length} comments
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {post.caption}
                  </Typography>
                  {post.comments.map((comment, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      <strong>{comment.user}:</strong> {comment.text}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', mt: 'auto' }}> {/* mt: 'auto' ensures the input stays at the bottom */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Add a comment..."
                    InputProps={{
                      endAdornment: (
                        <IconButton edge="end" sx={{ color: '#9c27b0' }}>
                          <SendIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  );
}
