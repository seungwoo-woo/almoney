import React, { useEffect, useState, useContext } from 'react'
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PersonOffTwoToneIcon from '@mui/icons-material/PersonOffTwoTone';
import { pink } from '@mui/material/colors';
import { Dialog, DialogContent, DialogTitle, DialogActions, TextField, Table, TableHead, TableBody, TableCell, TableRow, Input, Container } from "@mui/material";
import ReportIcon from '@mui/icons-material/Report';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



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


function AdminCellEdit(props) {

  const { id, getDataRefresh, editCase } = props

  const [adminEditCase, setAdminEditCase] = useState([{}]);
  const [isCompUpdateDialogOpen, setIsCompUpdateDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);


  // Edit 대상 User 정보 읽어오기 ------------------------------------------------
  const getAdminEditCase1 = async () => {
    const querySnapshot = await getDoc(doc(db, "Users", id));
    setAdminEditCase(querySnapshot.data());
  }

  // --------------------------------------------------------------------
  const CompletedUpdateDialogOpen = () => {
    setIsCompUpdateDialogOpen(true);
  };

  // --------------------------------------------------------------------
  const hdcEditClose = () => {
    if (editCase === 1) {
      getAdminEditCase1();
    } 
    setIsEditOpen(false);
  };


  // --------------------------------------------------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      if (editCase === 1) {
        const docRef = await updateDoc(doc(db, "Users", id), {
          userGrade: adminEditCase.userGrade,
          in: adminEditCase.in,
          out: adminEditCase.out,
        });}

      CompletedUpdateDialogOpen();
      hdcEditClose()
    
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    hdcEditClose();
  }


  // --------------------------------------------------------------------
  const hdcEditOpen = () => {
    setIsEditOpen(true);
  };


  // --------------------------------------------------------------------
  const handleClickCompUpdateDialogClose = () => {
    setIsCompUpdateDialogOpen(false);
    getDataRefresh();
  };


  // --------------------------------------------------------------------
  const handleValueChange = (e) => {
    const keyValue = e.target.id;
    const editCopy = {...adminEditCase, [keyValue]: e.target.value };
    setAdminEditCase(editCopy);
  };


  // useEffect 1 Start ========================================================
  useEffect(()=>{

  if (editCase === 1) {
    getAdminEditCase1();
  } 

  },[])


  return (    
    <>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <EditCalendarTwoToneIcon cursor='pointer' variant='contained' color='primary' sx={{ fontSize: 20 }} onClick={hdcEditOpen}/>
    </div>

    <Dialog open={isEditOpen} onClose={hdcEditClose}>
      {(editCase === 1) && <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
      <ReportIcon sx={{mr: 1}}/>사용자 정보 수정 (A-관리자, B-직원)</DialogTitle>}
      <Divider />       
      <DialogContent>
        {(editCase === 1) && <TextField value={adminEditCase.name} id="name" label="이름" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 1) && <TextField value={adminEditCase.userGrade} id="userGrade" label="권한등급" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 1) && <TextField value={adminEditCase.in} id="in" label="출근시간" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
        {(editCase === 1) && <TextField value={adminEditCase.out} id="out" label="퇴근시간" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" /> }
      </DialogContent>
      <DialogActions>
        <Button onClick={hdcEditClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>          
      </DialogActions>
    </Dialog>


    <Dialog
    open={isCompUpdateDialogOpen}
    onClose={handleClickCompUpdateDialogClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>{" 정보 수정 "}
      </DialogTitle>
      <Divider />
      <DialogContent>      
        <Typography>
          해당 정보가 정상적으로 수정되었습니다.
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClickCompUpdateDialogClose}>OK</Button>
      </DialogActions>
    </Dialog>
  </>
  )
}

export default AdminCellEdit