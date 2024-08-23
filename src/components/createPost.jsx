import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  Button,
  Snackbar,
} from '@mui/material';
import { AddAPhoto, Close } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreatePost({ open, onClose }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef(null);

  const handleClose = () => {
    onClose();
    setImage(null);
    setCaption('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    // Here you would typically send the image and caption to your backend
    console.log('Posting:', { image, caption });
    setShowToast(true);
    handleClose();
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToast(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create Post
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!image ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                border: '2px dashed grey',
                borderRadius: 2,
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
              />
              <AddAPhoto sx={{ fontSize: 60, color: 'grey' }} />
              <Button>Upload from device</Button>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <img
                src={image}
                alt="Preview"
                style={{ width: '100%', height: 'auto', maxHeight: 300, objectFit: 'contain' }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="caption"
                label="Add a caption"
                type="text"
                fullWidth
                variant="standard"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handlePost} disabled={!image} variant="contained">
            Post
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={showToast} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity="success" sx={{ width: '100%' }}>
          Post created successfully!
        </Alert>
      </Snackbar>
    </>
  );
}