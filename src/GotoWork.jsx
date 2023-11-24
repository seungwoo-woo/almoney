import React, { useEffect, useState, useContext } from 'react'
import Button from '@mui/material/Button';
import { Container, Stack } from '@mui/material';
import { pink } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import ReportIcon from '@mui/icons-material/Report';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import { DialogContent, DialogTitle, DialogContentText, DialogActions, Table, TableBody, TableCell, TableRow, TextField, Select, MenuItem, Box, FormControl, InputLabel } from "@mui/material";
import ResponsiveAppBar from './ResponsiveAppBar.jsx';
import { UserCompanyContext } from './context/UserCompanyContext';
import { UserNameContext } from './context/UserNameContext';
import { UserGradeContext } from './context/UserGradeContext';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';




// firebase import=======================================================
import { firebaseConfig } from './Firebase.js';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Timestamp, getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, setDoc, query, where, orderBy} from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// Function Start =======================================================================

function GotoWork() {

  const navigate = useNavigate();

  let isGotoWorkTime = false
  let isWorkTime = false
  let isGooutWorkTime = false
  let goToWorkNo = 0

  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1);
  const date = String(today.getDate());
  const YearAndMonth = year + month;
  const hours = Number(today.getHours());
  const minutes = Number(today.getMinutes());

  const { userCompany, setUserCompany } = useContext(UserCompanyContext);
  const { userName, setUserName } = useContext(UserNameContext);
  const { userGrade, setUserGrade } = useContext(UserGradeContext);

  const [isCompUpdateDialogOpen, setIsCompUpdateDialogOpen] = useState(false);
  const [msg, setMsg] = useState('출근');
  const [dailyData, setDailyData] = useState(['']);

  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate('/dashBoard')
  }

  if (1 <= hours && 12 >= hours) {
    isGotoWorkTime = true
  }

  if (17 <= hours && 24 >= hours) {
    isGooutWorkTime = true
  }

  if (12 < hours && 17 > hours) {
    isWorkTime = true
  }


  // --------------------------------------------------------------------
  const handleClickCompUpdateDialogClose = () => {
    setIsCompUpdateDialogOpen(false);
    navigate('/dashBoard');
  };

  // --------------------------------------------------------------------
  const CompletedUpdateDialogOpen = () => {
    setIsCompUpdateDialogOpen(true);
  };


  // useEffect 1 Start ========================================================
  useEffect(()=>{

    const getUserInformation = () => {    
  
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userCompany = '';
        let userName = '';
        let userGrade = '';
        const querySnapshot = await getDocs(query(collection(db, "Users"), where("id", "==", user.uid)));
        querySnapshot.forEach((doc) => {
        userCompany = (doc.data().company);
        userName = (doc.data().name);
        userGrade = (doc.data().userGrade);
        setUserCompany(userCompany);
        setUserName(userName);
        setUserGrade(userGrade);
        });
      } else {
        navigate('/');
      }
    });    
    }    
    getUserInformation();
  
  }, []);



  // useEffect Start -------------------------------------------------------------------
  useEffect(()=> {

    const getDailyData = async () => {

      // const querySnapshot = await getDoc(doc(db, "HeeNWoo", YearAndMonth));
      const querySnapshot = await getDoc(doc(db, userCompany, YearAndMonth));

      if (!querySnapshot.exists()) {
        await setDoc(doc(db, userCompany, YearAndMonth),{
          [date]: []                                        // 매월 1일 자료 생성
        });
      } else {
        const keys = Object.keys(querySnapshot.data())
        if (!keys.includes(date)) {
          await setDoc(doc(db, userCompany, YearAndMonth),{
            ...querySnapshot.data(), [date]: []             // 매일 신규 자료 생성
          });
        }
      }

      setDailyData(querySnapshot.data());

    } // function End --------------------------------------------------

    if(userCompany) {
      getDailyData() }

  }, [userCompany]) 
// useEffect End -------------------------------------------------------------------



// 출근 ----------------------------------------------------------------------------
  const writeDailyDataIn = async () => {

    let dailyDataCopy = []
    const addData = {name: userName, in: Timestamp.fromDate(new Date()), out: ""};

    const querySnapshot = await getDoc(doc(db, userCompany, YearAndMonth));
    dailyDataCopy = querySnapshot.data()[date];    
    
    dailyDataCopy.push(addData);

    await updateDoc(doc(db, userCompany, YearAndMonth), {
      [date]: dailyDataCopy
    })
    
    setMsg('출근')
    CompletedUpdateDialogOpen();    

  } // function End --------------------------------------------------


// 퇴근 ----------------------------------------------------------------------------
  const writeDailyDataOut = async () => {

    let dailyDataCopy = []

    const querySnapshot = await getDoc(doc(db, userCompany, YearAndMonth));
    dailyDataCopy = querySnapshot.data()[date];

    for (let i = 0; i < dailyDataCopy.length; i++ ) {
      if (dailyDataCopy[i]['name'] === userName) {
        dailyDataCopy[i]['out'] = Timestamp.fromDate(new Date())
      }
    }

    await updateDoc(doc(db, userCompany, YearAndMonth), {
      [date]: dailyDataCopy  
    })

    setMsg('퇴근')
    CompletedUpdateDialogOpen();

  } // function End --------------------------------------------------

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  

  if (dailyData[date] && isGotoWorkTime) {
    for (let i = 0 ; i < dailyData[date].length ; i++) {
      if (dailyData[date][i]['name'] === userName) {

        return (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
              <ReportIcon sx={{mr: 1}}/>{" 출/퇴근하기 확인 "}
            </DialogTitle>
            <Divider />
            <DialogContent>      
              <Typography>
                이미 출근하기 버튼을 누른 사용자입니다.
              </Typography>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button onClick={handleClose}>OK</Button>
            </DialogActions>
          </Dialog>
        )
      }
    }    
  }


  if (dailyData[date] && isGooutWorkTime) {
    for (let i = 0 ; i < dailyData[date].length ; i++) {
      if (dailyData[date][i]['name'] === userName && dailyData[date][i]['out'] !== "") {

        return (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
              <ReportIcon sx={{mr: 1}}/>{" 출/퇴근하기 확인 "}
            </DialogTitle>
            <Divider />
            <DialogContent>      
              <Typography>
                이미 퇴근하기 버튼을 누른 사용자입니다.
              </Typography>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button onClick={handleClose}>OK</Button>
            </DialogActions>
          </Dialog>
        )
      }
    }    
  }


  return (
    <>
    <ResponsiveAppBar />
    <Container maxWidth='xs' sx={{mt: 5}}>      
      {isGotoWorkTime &&  
      <Stack maxWidth='sm' spacing={2} >
        <Button variant="contained" size='large' onClick={writeDailyDataIn} sx={{fontWeight: 600}}> 출근 </Button>
        <Button variant="contained" size='large' onClick={writeDailyDataOut} disabled> 퇴근 </Button>
      </Stack>
      }      
      {isGooutWorkTime &&
      <Stack maxWidth='sm' spacing={2} >
        <Button variant="contained" size='large' onClick={writeDailyDataIn} disabled sx={{fontWeight: 600}}> 출근 </Button>
        <Button variant="contained" size='large' onClick={writeDailyDataOut} sx={{fontWeight: 600}}> 퇴근 </Button>
      </Stack>
      } 
      {isWorkTime &&
      <Stack maxWidth='sm' spacing={2} >
        <Button variant="contained" size='large' onClick={writeDailyDataIn} disabled sx={{fontWeight: 600}}> 출근 </Button>
        <Button variant="contained" size='large' onClick={writeDailyDataOut} disabled sx={{fontWeight: 600}}> 퇴근 </Button>
        <Button variant="contained" size='large' disabled sx={{fontWeight: 600}}> 지금은 근무시간 입니다. </Button>
      </Stack>
      }
    </Container>

    <Dialog
      open={isCompUpdateDialogOpen}
      onClose={handleClickCompUpdateDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" 출/퇴근하기 확인 "}
      </DialogTitle>
      <Divider />
      <DialogContent>      
        <Typography>
          {msg}이 정상적으로 처리되었습니다.
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClickCompUpdateDialogClose}>OK</Button>
      </DialogActions>
    </Dialog>


    </>
  )

} // Function End ==========================================================================

export default GotoWork