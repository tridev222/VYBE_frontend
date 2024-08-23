import React, { useState } from 'react';
import { Avatar, Box, Button, TextField, Grid, Card, CardContent, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { Link } from 'react-router-dom';

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

export default function EditProfile() {
  const [gender, setGender] = useState('');

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <Box sx={{ minHeight: '85vh', backgroundColor: '#fff', p: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', pb: 4, borderBottom: '1px solid #ccc' }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar sx={{ width: 128, height: 128 }} src="/placeholder-user.jpg" alt="John Doe">
            JD
          </Avatar>
          <Button variant="outlined" component="label" sx={{ mt: 2, display: 'block' }}>
            Choose Image
            <input hidden type="file" />
          </Button>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField variant="outlined" label="Name" defaultValue="sample user" fullWidth sx={{ mb: 1 }} />
          <TextField variant="outlined" label="Username" defaultValue="@testuser" fullWidth sx={{ mb: 1 }} />
        </Box>
        <Box>
          <Button
            variant="outlined"
            component={Link}
            to="/profile"
            sx={getButtonStyle()} // Apply custom style
          >
            Save
          </Button>
        </Box>
      </Box>

      <Box sx={{ pt: 4 }}>
        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField variant="outlined" label="Bio" multiline rows={4} defaultValue="test bio section here is to edit the bio section." fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField variant="outlined" label="Website" defaultValue="sample.com" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField variant="outlined" label="Location" defaultValue="bareilly, UP" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Gender</InputLabel>
                  <Select value={gender} onChange={handleGenderChange} label="Gender">
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="preferNotToSay">Prefer not to specify</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
