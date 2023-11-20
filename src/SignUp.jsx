// react & material UI import ==================================================
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { pink } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ReportIcon from '@mui/icons-material/Report';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


// firebase import=======================================================
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './Firebase.js';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDoc, updateDoc, doc, addDoc, query, where, orderBy} from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// Initialize Variable ==================================================
const defaultTheme = createTheme();




//  ======================================================================================
// Function 시작 =========================================================================
// =======================================================================================
export default function SignUp() {

// Initialize Variable ==================================================
const [msgOpen, setMsgOpen] = React.useState(false);
const [errMsgOpen, setErrMsgOpen] = React.useState(false);
const [ msg, setMsg ] = React.useState('');
const navigate = useNavigate();


// Define subFunction ==================================================
//-----------------------------------------------------------------------
const handleSignUpMsgOpen = () => {
  setMsgOpen(true);
};

//-----------------------------------------------------------------------
const handleSignUpMsgClose = () => {
  setMsgOpen(false);
  navigate('/');
};

//-----------------------------------------------------------------------
const handleSignUpErrMsgOpen = () => {
  setErrMsgOpen(true);
};

//-----------------------------------------------------------------------
const handleSignUpErrMsgClose = () => {
  setErrMsgOpen(false);
};

//-----------------------------------------------------------------------
const handleSubmit = async (event) => {
  event.preventDefault();    
  const data = new FormData(event.currentTarget);

  if (data.get('password') === data.get('password2')) {

    createUserWithEmailAndPassword(auth, data.get('email'), data.get('password'))
    .then((userCredential) => {

    const user = userCredential.user; 
    
    const docRef = addDoc(collection(db, "HeeNWoo"), {
      id: user.uid,
      name: data.get('firstName'),
      company: data.get('company'),
      email: data.get('email'),
      isDeleted: 0,
      userGrade: 'D'
    });

    handleSignUpMsgOpen();
    })
    .catch((error) => {
    const errorMessage = error.message;

    if (errorMessage === 'Firebase: Error (auth/email-already-in-use).') {
      setMsg('동일한 email로 생성된 계정이 있습니다.');
    } 
    else if (errorMessage === 'Firebase: Error (auth/invalid-email).') {
      setMsg('email 형식이 잘못되었습니다.');
    }
    else if (errorMessage === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
      setMsg('password는 6자리 이상으로 설정하세요');
    }
    else {
      setMsg(errorMessage);
    }

    handleSignUpErrMsgOpen();
    });


  } else {
    setMsg('password가 일치하지 않습니다. password를 다시 입력하세요.');
    handleSignUpErrMsgOpen();
  }

  
};



// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <>
  <ThemeProvider theme={defaultTheme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5"> Sign up </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField autoComplete="given-name" name="firstName" required fullWidth 
              id="firstName" label="성명" autoFocus />
          </Grid>
          <Grid item xs={12}>
            <TextField autoComplete="given-name" name="company" required fullWidth 
              id="company" label="소속 회사 상호" />
          </Grid>
          <Grid item xs={12}>
            <TextField id="email" autoComplete="email" label="Email Address" name="email" required fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField autoComplete="new-password" name="password" label="Password" id="password" type="password" required fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField autoComplete="new-password" name="password2" label="Password 확인" id="password2" type="password" required fullWidth />
          </Grid>
          </Grid>
          <Button sx={{ mt: 3, mb: 2 }} type="submit" fullWidth variant="contained" >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  </ThemeProvider>


  {/* SingUp alert ===========================================*/}
  <Dialog
      open={msgOpen}
      onClose={handleSignUpMsgClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" 계정 생성 "}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
          계정이 정상적으로 생성되었습니다. 
        </Typography>
        <Typography sx={{color: pink[500], fontWeight: '400'}}>
          로그인 전, 관리자에게 권한등급조정을 요청하세요.
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleSignUpMsgClose} autoFocus> OK </Button>
      </DialogActions>
    </Dialog>


  {/* SingUp error alert =====================================*/}
  <Dialog
      open={errMsgOpen}
      onClose={handleSignUpErrMsgClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" 계정 생성 오류 "}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
          {msg}
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleSignUpErrMsgClose} autoFocus> OK </Button>
      </DialogActions>
    </Dialog>
  </>
);

// Component End =========================================================
} 