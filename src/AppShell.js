import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';




function AppShell() {

  const [toggle, setToggle] = useState(false);

  const handleDrawerToggle = () => setToggle((prev) => !prev);

  return (
    <>
      <AppBar position='static'>
        <IconButton style={{marginRight: 'auto'}} sx={{ mr: 2 }} color='inherit' onClick={handleDrawerToggle}>
          <MenuIcon /> MUI
        </IconButton>
      </AppBar>
      <Drawer open={toggle}>
        <MenuItem onClick={handleDrawerToggle}>Home</MenuItem>
      </Drawer>

    </>
    );

}

export default AppShell;