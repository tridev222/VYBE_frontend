// src/components/Auth.js
import { Box, Button, TextField, Slide, Link } from '@mui/material';
import React, { useState } from 'react';
import Logo from '../assets/logo_light.png'; // Adjust the import path if needed

const getButtonStyle = () => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#a81434',
  '&:hover': {
    backgroundColor: '#89112c',
  },
  width: '12rem',
});

function Auth() {
  const [view, setView] = useState('default'); // default, signin, signup

  const handleSignInClick = () => {
    setView('signin');
  };

  const handleSignUpClick = () => {
    setView('signup');
  };

  const handleLogoClick = () => {
    setView('default');
  };

  return (
    <Box display="flex" height="100vh" maxHeight={655}>
      
      {/* Logo Section */}
      <Box 
        flex={1} 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        sx={{ 
          transition: 'transform 0.5s ease',
          transform: view === 'signup' ? 'translateX(100%)' : 'none', // Move logo to the right for signup view
          cursor: view !== 'default' ? 'pointer' : 'default',
          zIndex:2
        }}
        onClick={view !== 'default' ? handleLogoClick : null}
      >
        <img 
          src={Logo} 
          alt="VYBE logo" 
          style={{ 
            width: '25rem', 
            height: 'auto',
            transition: 'transform 0.5s ease',
          }}
        />
      </Box>

      {/* Signup Form Section */}
      {view === 'signup' && (
        <Box 
          position="absolute"
          top={0}
          left={0}
          height="100%"
          width="50%" // Adjust as needed
          sx={{ 
            transition: 'all 0.5s ease', 
          }}
        >
          <Slide direction="right" in={view === 'signup'} mountOnEnter unmountOnExit>
            <Box 
              display="flex" 
              flexDirection="column" 
              justifyContent="center" 
              alignItems="center"
              height="100%"
              padding="0 2rem"
              boxSizing="border-box"
            >
              <TextField 
                label="Email" 
                variant="outlined" 
                fullWidth 
                sx={{ marginBottom: '1rem' }} 
              />
              <TextField 
                label="Username" 
                variant="outlined" 
                fullWidth 
                sx={{ marginBottom: '1rem' }} 
              />
              <TextField 
                label="Password" 
                type="password" 
                variant="outlined" 
                fullWidth 
                sx={{ marginBottom: '1.5rem' }} 
              />
              <Button 
                variant="contained" 
                sx={{
                  width: '100%',
                  backgroundColor: '#a81434',
                  '&:hover': { backgroundColor: '#89112c' },
                  marginBottom: '1rem',
                }}
              >
                Sign Up
              </Button>
              <Link 
                href="#" 
                onClick={() => setView('signin')}
                sx={{ color: '#a81434', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Already have an account? Login
              </Link>
            </Box>
          </Slide>
        </Box>
      )}

      {/* Button/Form Section */}
      <Box 
        flex={1} 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        sx={{
          position: 'relative',
          overflow: 'hidden', 
        }}
      >
        {view === 'default' && (
          <Box 
            display="flex" 
            justifyContent="space-evenly" 
            width="80%" 
            sx={{ transition: 'all 0.5s ease' }}
          >
            <Button 
              className="shadow-2xl" 
              sx={getButtonStyle()} 
              onClick={handleSignInClick}
            >
              SIGN IN
            </Button>
            <Button 
              className="shadow-2xl" 
              sx={getButtonStyle()} 
              onClick={handleSignUpClick}
            >
              SIGN UP
            </Button>
          </Box>
        )}

        {view === 'signin' && (
          <Slide direction="left" in={view === 'signin'} mountOnEnter unmountOnExit>
            <Box 
              display="flex" 
              flexDirection="column" 
              justifyContent="center" 
              alignItems="center"
              sx={{
                position: 'absolute',
                top: 0,
                left: '0',
                width: '100%',
                height: '100%',
                padding: '0 2rem',
                boxSizing: 'border-box',
              }}
            >
              <TextField 
                label="Username" 
                variant="outlined" 
                fullWidth 
                sx={{ marginBottom: '1rem' }} 
              />
              <TextField 
                label="Password" 
                type="password" 
                variant="outlined" 
                fullWidth 
                sx={{ marginBottom: '1.5rem' }} 
              />
              <Button 
                variant="contained" 
                sx={{
                  width: '100%',
                  backgroundColor: '#a81434',
                  '&:hover': { backgroundColor: '#89112c' },
                  marginBottom: '1rem',
                }}
              >
                Login
              </Button>
              <Link 
                href="#" 
                onClick={() => setView('signup')}
                sx={{ color: '#a81434', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Don't have an account? Sign up
              </Link>
            </Box>
          </Slide>
        )}
      </Box>
    </Box>
  );
}

export default Auth;
