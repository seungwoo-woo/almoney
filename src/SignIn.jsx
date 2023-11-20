// react & material UI import ==================================================
import * as React from 'react';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { pink } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import ReportIcon from '@mui/icons-material/Report';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './Firebase.js';
import { getFirestore, collection, getDocs, query, where, orderBy} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// Initialize Variable ==================================================
const defaultTheme = createTheme();




//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================

export default function SignIn() {

// Initialize Variable ==================================================
const [ errMsgOpen, setErrMsgOpen ] = React.useState(false);
const [ msg, setMsg ] = React.useState('');
const [ unconfirmUserEmailList, setUnconfirmUserEmailList ] = React.useState([]);

const navigate = useNavigate();


// Define subFunction ==================================================
//-----------------------------------------------------------------------
const handleSignInErrMsgOpen = () => {
  setErrMsgOpen(true);
};


//-----------------------------------------------------------------------
const handleCloseError = () => {
  setErrMsgOpen(false);
};


//-----------------------------------------------------------------------
const handleSubmit = (event) => {

  event.preventDefault();

  const data = new FormData(event.currentTarget);

  if (unconfirmUserEmailList.includes(data.get('email'))) {
    setMsg('아이디가 비활성화되어 로그인할 수 없습니다. 관리자에게 문의하세요');
    handleSignInErrMsgOpen();
    navigate('/');
  } else {
    signInWithEmailAndPassword(auth, data.get('email'), data.get('password'))
    .then((userCredential) => {
      navigate(`/GotoWork`);
    })
    .catch((error) => {
      setMsg('email 또는 password에 오류가 있습니다.');
      handleSignInErrMsgOpen();
    });    
  }
};



// useEffect 1 Start ========================================================
useEffect(()=>{ 
  
  // 사용자 리스트 읽어오기 --------------------------------------------------
  const getUser = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "HeeNWoo"), orderBy("name", "asc"), where("userGrade", "==", 'D')));
    querySnapshot.forEach((doc) => {
      data.push(doc.data().email);
    });
    setUnconfirmUserEmailList(data);
  }
  getUser();

}, []);



// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <>
  <ThemeProvider theme={defaultTheme}>
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
                <Link href="/signUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>

            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </ThemeProvider>

  {/* SingIn error alert */}
  <Dialog
      open={errMsgOpen}
      onClose={handleCloseError}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" 로그인 오류 "}
      </DialogTitle>
      <Divider />
      <DialogContent>      
        <Typography>
          {msg}
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleCloseError} autoFocus> OK </Button>          
      </DialogActions>
    </Dialog>
  </>
);

// Component End =========================================================
}
