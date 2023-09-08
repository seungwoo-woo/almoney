import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';


function AppShell() {

  const [toggle, setToggle] = useState(false);

  const handleDrawerToggle = () => setToggle((prev) => !prev);

  return (
    <div style={{flexGrow: 1}}>
      <AppBar position='static'>
        <IconButton style={{marginRight: 'auto'}} color='inherit' onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </AppBar>
      <Drawer open={toggle}>
        <MenuItem onClick={handleDrawerToggle}>Home</MenuItem>
      </Drawer>

    </div>
    );

}

export default AppShell;