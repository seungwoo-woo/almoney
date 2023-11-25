import React, { useEffect, useState, useContext } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, IconButton, TableHead, TableBody, TableCell, TableRow, TableFooter, TablePagination, tableCellClasses, Container } from "@mui/material";
import { UserCompanyContext } from './context/UserCompanyContext';
import { UserNameContext } from './context/UserNameContext';
import { UserGradeContext } from './context/UserGradeContext';
import { useNavigate } from 'react-router-dom';
import ResponsiveAppBar from './ResponsiveAppBar'
import AddOneRow from './AddOneRow';
import { Button, Card } from '@mui/material';


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


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});



function AdminPage() {

  const navigate = useNavigate();
  const { userCompany, setUserCompany } = useContext(UserCompanyContext);
  const { setUserName } = useContext(UserNameContext);
  const { setUserGrade }= useContext(UserGradeContext);

  const [userList, setUserList] = useState([])
  const [editCase, setEditCase] = useState()
  const [openEmployee, setOpenEmployee] = useState(false)

  // Table style ----------------------------------------------------
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#1976d2',
      color: theme.palette.common.white,
      fontSize: 14,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));



  // Refresh userList-------------------------------------------------------------
  const getUserList = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "Users"), orderBy("name", "asc"), where("company", "==", userCompany)));
    querySnapshot.forEach((doc) => {
      data.push({...doc.data(), id: doc.id,})
    });
    setUserList(data);
  }


  const handleClickEmployee = async() => {
    setEditCase(1)
    setOpenEmployee(true)
  }


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


  // useEffect 2 Start ========================================================
  useEffect(()=>{ 

    // 사용자 리스트 읽어오기 --------------------------------------------------
    const getUser = async () => {
    let data = [];
    const querySnapshot = await getDocs(query(collection(db, "Users"), orderBy("name", "asc"), where("company", "==", userCompany)));
    querySnapshot.forEach((doc) => {
      data.push({...doc.data(), id: doc.id,})
      // data.push(doc.data().comName);
    });
    setUserList(data);
  }
  getUser();

  },[openEmployee])



  return (
    <>
      <ResponsiveAppBar />
      
      <Card sx={{ minWidth: 275, m: 1, pt: 0.5, flexFlow: 'wrap' }} >
      <Breadcrumbs aria-label="breadcrumb">
        <Button onClick={handleClickEmployee}>직원관리</Button>
        <Button>추가</Button>
      </Breadcrumbs>
      </Card>

      {openEmployee && <Card sx={{ minWidth: 275, m: 1, flexFlow: 'wrap' }}>        
        <Table stickyHeader size='small' aria-label="sticky table">        
          <TableHead>
            <TableRow>
              <StyledTableCell style={{fontWeight: 400}} align='center' >No.</StyledTableCell>
              <StyledTableCell style={{fontWeight: 400}} align='center' >사용자</StyledTableCell>
              <StyledTableCell style={{fontWeight: 400}} align='center' >권한</StyledTableCell>
              <StyledTableCell style={{fontWeight: 400}} align='center' >출근</StyledTableCell>
              <StyledTableCell style={{fontWeight: 400}} align='center' >퇴근</StyledTableCell>
              <StyledTableCell style={{fontWeight: 600, color: "yellow"}} align='center' >ACT.</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((item, index) => {
                  return (<AddOneRow 
                    key = {item.id}
                    id = {item.id} 
                    no = {index + 1}
                    cell1 = {item.name}
                    cell2 = {item.userGrade}
                    cell3 = {item['w-in']}
                    cell4 = {item['w-out']}
                    getDataRefresh={getUserList}
                    editCase={editCase}
                    />
                  );    // return ----------
              })
            }
          </TableBody>
        </Table>
      </Card>}      
    </>
  )
}

export default AdminPage