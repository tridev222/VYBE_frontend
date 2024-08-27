import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, Avatar } from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon, Explore as ExploreIcon, AddBox as CreateIcon, Menu as MenuIcon } from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';
import SearchPanel from './SearchPanel';
import More from './More';
import CreatePost from './createPost'; // Import the CreatePost component
import { styled } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo_light.png';
import LogoIcon from '../assets/logo_icon_light.png';
import axios from 'axios';
import defaultProfileImage from '../assets/default_profile.jpg'; // Placeholder for profile pic

// Drawer width
const drawerWidth = 240;

// Styled ListItem component
const StyledListItem = styled(ListItem)(({ theme, isCollapsed }) => ({
  padding: '15px 30px', // Increased padding for bigger items
  justifyContent: isCollapsed ? 'center' : 'flex-start', // Center icons in collapsed state
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Instagram Logo styling
const InstagramLogo = styled(Box)(({ isCollapsed }) => ({
  backgroundImage: `url(${isCollapsed ? LogoIcon : Logo})`, // Switch logos based on collapse state
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  width: isCollapsed ? '40px' : '175px', // Adjust the width based on the logo
  height: isCollapsed ? '40px' : '51px', // Adjust the height based on the logo
  marginTop: '25px',
  backgroundRepeat: 'no-repeat',
  display: 'inline-block',
  zIndex: 2,
}));

const SideNav = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false); // State for CreatePost dialog
  const [activeTab, setActiveTab] = useState('/home'); // Store the last active tab
  const [lastActiveTab, setLastActiveTab] = useState('/home'); // Store the last active tab excluding search
  const [profilePic, setProfilePic] = useState(null); // State to hold the profile picture URL

  const location = useLocation(); // Get current location
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  // Handle state reset when navigating to a new route
  useEffect(() => {
    const path = location.pathname;
    
    if (path !== activeTab) {
      if (path === '/chat') {
        setCollapsed(true); // Collapse sidebar for chat
      } else {
        setCollapsed(false); // Expand sidebar for other routes
      }
      
      setSearchOpen(false); // Close search panel
      setActiveTab(path); // Update active tab
      if (path !== '/search') { // Update last active tab excluding search
        setLastActiveTab(path);
      }
    }
  }, [location, activeTab]);

  // Fetch the profile picture (same logic as in Profile component)
  useEffect(() => {
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
          setProfilePic(userData.profilePicture || defaultProfileImage);
        } else {
          console.error("Failed to fetch user data", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setProfilePic(defaultProfileImage);
      }
    };

    fetchUserProfile();
  }, []);

  const handleMoreClick = () => {
    setIsMoreOpen(!isMoreOpen); // Toggle the state
  };

  const handleSearchClick = () => {
    setSearchOpen(!isSearchOpen);
    setCollapsed(true); // Collapse sidebar when search is opened
  };

  const handleChatClick = () => {
    if (activeTab === '/chat') {
      setActiveTab(lastActiveTab); // Go back to the last active tab excluding search
    } else {
      setCollapsed(true); // Collapse sidebar for chat
      setActiveTab('/chat'); // Set chat as active
    }
  };

  const handleCreateClick = () => {
    setCreatePostOpen(true); // Open the CreatePost dialog
  };

  const handleCreatePostClose = () => {
    setCreatePostOpen(false); // Close the CreatePost dialog
  };

  const fullNav = (
    <Box
      sx={{
        width: isCollapsed ? 60 : drawerWidth,
        position: 'fixed',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        top: 0,
        left: 0,
        padding: 2,
        backgroundColor: '#fff',
        zIndex: 1300,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        borderRight: '0.35px solid grey',
      }}
    >
      <Box>
        <Box
          sx={{
            width: '100%',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px', // Added more space between logo and items
          }}
        >
          <Link to={activeTab}>
            <InstagramLogo isCollapsed={isCollapsed} />
          </Link>
        </Box>
        <List sx={{ marginTop: '0' }}>
          <StyledListItem button component={Link} to="/home" isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <HomeIcon fontSize="large" />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Home" />}
          </StyledListItem>
          <StyledListItem button component={Link} to="/feed" isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <ExploreIcon fontSize="large" />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Feed" />}
          </StyledListItem>
          <StyledListItem button onClick={handleSearchClick} isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <SearchIcon fontSize="large" />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Search" />}
          </StyledListItem>
          <StyledListItem button onClick={handleChatClick} component={Link} to="/chat" isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <ChatIcon fontSize="large" />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Chat" />}
          </StyledListItem>
          <StyledListItem button onClick={handleCreateClick} isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <CreateIcon fontSize="large" />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Create" />}
          </StyledListItem>
          <StyledListItem button component={Link} to="/profile" isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <Avatar src={profilePic} sx={{ width: 32, height: 32 }} /> {/* Display the profile picture */}
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Profile" />}
          </StyledListItem>
        </List>
      </Box>
      <StyledListItem
        button
        sx={{ marginBottom: '1rem' }}
        onClick={handleMoreClick}
        isCollapsed={isCollapsed}
      >
        <ListItemIcon sx={{ minWidth: '35px', color: '#a81434' }}> {/* Ruby color for More icon */}
          <MenuIcon fontSize="large" />
        </ListItemIcon>
        {!isCollapsed && <ListItemText primary="More" />}
      </StyledListItem>
      <More isMoreOpen={isMoreOpen} setIsMoreOpen={setIsMoreOpen} />
    </Box>
  );

  const bottomNav = (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        zIndex: 1300,
      }}
    >
      <ListItem button component={Link} to="/">
        <ListItemIcon><HomeIcon /></ListItemIcon>
      </ListItem>
      <ListItem button onClick={handleSearchClick}>
        <ListItemIcon><SearchIcon /></ListItemIcon>
      </ListItem>
      <ListItem button onClick={handleChatClick}>
        <ListItemIcon><ChatIcon /></ListItemIcon>
      </ListItem>
      <ListItem button onClick={handleCreateClick}>
        <ListItemIcon><CreateIcon /></ListItemIcon>
      </ListItem>
      <ListItem button component={Link} to="/feed">
        <ListItemIcon><ExploreIcon /></ListItemIcon>
      </ListItem>
      <ListItem button onClick={handleMoreClick}>
        <ListItemIcon><MenuIcon /></ListItemIcon>
      </ListItem>
      <More isMoreOpen={isMoreOpen} setIsMoreOpen={setIsMoreOpen} />
    </Box>
  );

  return (
    <>
      {isSmallScreen ? bottomNav : fullNav}
      <SearchPanel open={isSearchOpen} onClose={() => setSearchOpen(false)} /> {/* Added close function */}
      <CreatePost open={isCreatePostOpen} onClose={handleCreatePostClose} /> {/* Render CreatePost dialog */}
    </>
  );
};

export default SideNav;
