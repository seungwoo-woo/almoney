// react & material UI import ==================================================
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SatelliteAltTwoToneIcon from '@mui/icons-material/SatelliteAltTwoTone';
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';


// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './Firebase.js';
import { getAuth, signOut } from "firebase/auth";
import { UserCompanyContext } from './context/UserCompanyContext';
import { UserNameContext } from './context/UserNameContext';
import { UserGradeContext } from './context/UserGradeContext';


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);



//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================
function ResponsiveAppBar(props) {
  
// Initialize Variable ==================================================
const navigate = useNavigate();
const auth = getAuth(app);

const [anchorElNav, setAnchorElNav] = React.useState(null);
const [ anchorElUser, setAnchorElUser ] = React.useState(null);

const { userName } = useContext(UserNameContext);
const { userGrade } = useContext(UserGradeContext);
const { userCompany } = useContext(UserCompanyContext);


const settings = ['Logout'];
let pages = ['']

if (userGrade === 'A') {
  pages = ['출/퇴근하기', '출/퇴근현황', '관리자페이지'];
} else {
  pages = ['출/퇴근하기', '출/퇴근현황'];
}


// Define subFunction ==================================================
//-----------------------------------------------------------------------
const handleOpenNavMenu = (event) => {
  setAnchorElNav(event.currentTarget);
};

//-----------------------------------------------------------------------
const handleCloseNavMenu = (e) => { 
  if(e.target.innerText==='출/퇴근하기'){
    navigate('/gotoWork')
  }

  if(e.target.innerText==='출/퇴근현황'){
    navigate('/dashBoard')
  }

  if(e.target.innerText==='관리자페이지'){
    navigate('/admin')
  }

  setAnchorElNav(null);
  
};

//-----------------------------------------------------------------------
const handleOpenUserMenu = (event) => {
  setAnchorElUser(event.currentTarget);
};

//-----------------------------------------------------------------------
const handleJustCloseUserMenu = () => {
  setAnchorElUser(null);
}

//-----------------------------------------------------------------------
const handleCloseUserMenu = () => {
  setAnchorElUser(null);
  signOut(auth).then(() => {
    navigate('/');
  }).catch((error) => {

  });
};



// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

return (
  <AppBar position="relative" >
    <Container maxWidth="false">
      <Toolbar disableGutters>        
        <SatelliteAltTwoToneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Typography name='menu1' variant="h5" component="a" href="/dashBoard"
              sx={{ mr: 4, display: { xs: 'none', md: 'flex' }, fontWeight: 400, color:'inherit', textDecoration: 'none' }}
            >
              IAN Networks
            </Typography>

            <Typography variant="h10" component="a" href="/gotoWork"
              sx={{ mr: 2, pt: 0.8, display: { xs: 'none', md: 'flex' }, fontWeight: 200, color: 'inherit', textDecoration: 'none' }}
            >
              출/퇴근 하기
            </Typography>

            <Typography variant="h10" component="a" href="/dashBoard"
              sx={{ mr: 2, pt: 0.8, display: { xs: 'none', md: 'flex' }, fontWeight: 200, color: 'inherit', textDecoration: 'none' }}
            >
              출/퇴근 현황
            </Typography>

            {userGrade === 'A' && <Typography variant="h10" component="a" href="/admin"
              sx={{ mr: 2, pt: 0.8, display: { xs: 'none', md: 'flex' }, fontWeight: 200, color: 'inherit', textDecoration: 'none' }}
            >
              관리자페이지
            </Typography>}
          </Box>


          {/* 추가 ----------------- */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <SatelliteAltTwoToneIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/dashBoard"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 400,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            IAN Networks
          </Typography>

          {/* 추가 ----------------- */}



          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {/* <Typography variant="h6" sx={{ mr: 3,mt: 1, fontWeight: 400, color: 'yellow'}}>
              {userCompanyName} 
            </Typography> */}

            <Tooltip title="">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: deepOrange[500], width: 50, height: 50 }}>{userName}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleJustCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
      </Toolbar>
    </Container>
  </AppBar>
);

// Component End =========================================================
}

export default ResponsiveAppBar