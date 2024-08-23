import * as React from "react";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import { Divider, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function More({ isMoreOpen, setIsMoreOpen }) { // Ensure props are passed correctly
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const navigation = useNavigate();

  return (
    <Modal
      open={isMoreOpen}
      onClose={() => {
        setIsMoreOpen(false);
        setIsSettingsOpen(false); // Close settings menu when main menu is closed
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Paper
        style={{
          position: "fixed",
          top: "55%",
          left: "2rem",
          width: "17rem",
          height: "auto",
          borderRadius: "15px",
          zIndex: 2000,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
          color: "#000",
          fontFamily: "sans-serif",
        }}
      >
        <MenuList>
          <MenuItem
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" sx={{ color: "#000" }} />
            </ListItemIcon>
            <Typography variant="inherit">Setting</Typography>
          </MenuItem>

          {isSettingsOpen && (
            <Paper
              style={{
                position: "absolute",
                top: "0",
                left: "100%",
                width: "15rem",
                borderRadius: "15px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                marginLeft: "10px",
              }}
            >
              <MenuList>
                <MenuItem>
                  <Typography variant="inherit" style={{ fontWeight: 'bold' }}>
                    Setting
                  </Typography>
                </MenuItem>
                <MenuItem>Edit profile</MenuItem>
                <MenuItem>Notification</MenuItem>
                <MenuItem>Hide Story</MenuItem>
                <MenuItem>Live</MenuItem>
                <MenuItem>Blocked</MenuItem>
                <MenuItem>Privacy center</MenuItem>
                <MenuItem>Help</MenuItem>
              </MenuList>
            </Paper>
          )}

          <MenuItem>
            <ListItemIcon>
              <AssignmentOutlinedIcon fontSize="small" sx={{ color: "#000" }} />
            </ListItemIcon>
            <Typography variant="inherit">Your activity</Typography>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <BookmarkBorderOutlinedIcon fontSize="small" sx={{ color: "#000" }} />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Saved
            </Typography>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <LightModeOutlinedIcon fontSize="small" sx={{ color: "#000" }} />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Switch appearance
            </Typography>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <AnnouncementOutlinedIcon fontSize="small" sx={{ color: "#000" }} />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Report a problem
            </Typography>
          </MenuItem>
          <hr />
          <MenuItem>
            <Typography variant="inherit" noWrap>
              Switch accounts
            </Typography>
          </MenuItem>
          <Divider className="custom-divider" />
          <MenuItem onClick={() => { navigation('/login') }}>
            <Typography variant="inherit" noWrap>
              Log out
            </Typography>
          </MenuItem>
        </MenuList>
      </Paper>
    </Modal>
  );
}
