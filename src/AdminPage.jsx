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
import DashBoard2 from './DashBoard2';



// firebase import=======================================================
import { firebaseConfig } from './Firebase.js';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Timestamp, getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, setDoc, query, where, orderBy} from "firebase/firestore";
import { SignalCellular2BarOutlined } from '@mui/icons-material';




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
  const [haveMonth, setHaveMonth] = useState([])
  const [editCase, setEditCase] = useState()
  const [openEmployee, setOpenEmployee] = useState(false)
  const [openMonthData, setOpenMonthData] = useState(false)


  // Table style ----------------------------------------------------
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#1976d2',
      color: theme.palette.common.white,
      fontSize: 12,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
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
    setOpenMonthData(false)
  }


  const handleClickMonthData = async() => {
    setEditCase(2)
    setOpenEmployee(false)
    setOpenMonthData(true)
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



    // useEffect Start 월별 출퇴근 기록 가져오기 ----------------------------------------
    useEffect(()=> {

      const getMonthData = async () => {
  
        let tempArray = []
        let tempArray2 = []            
        const querySnapshot = await getDocs(collection(db, userCompany));
  
        querySnapshot.forEach((doc) => {
          tempArray.push(doc.data())
          tempArray2.push(doc.id)
          });

          console.log(tempArray)
          console.log(tempArray2)

        setHaveMonth(tempArray2);  

      } // function End --------------------------------------------------
  
      if(userCompany) {
        getMonthData() }
  
    }, [userCompany]) 
  // useEffect End -------------------------------------------------------------------



  return (
    <>
      <ResponsiveAppBar />
      
      <Card sx={{ minWidth: 275, m: 0.5, pt: 0.5, flexFlow: 'wrap' }} >
      <Breadcrumbs aria-label="breadcrumb">
        <Button onClick={handleClickEmployee}>직원관리</Button>
        <Button onClick={handleClickMonthData}>월간 출퇴근 현황</Button>
        <Button>추가버튼</Button>
      </Breadcrumbs>
      </Card>

      {/* 직원 관리 페이지 */}
      {openEmployee && <Card sx={{ minWidth: 275, m: 0.5, flexFlow: 'wrap' }}>        
        <Table stickyHeader size='small' aria-label="sticky table">        
          <TableHead>
            <TableRow>
              <StyledTableCell width='1' style={{fontSize: 14, fontWeight: 400}} align='center' rowSpan={2}>No</StyledTableCell>
              <StyledTableCell style={{fontSize: 14, fontWeight: 400}} align='center' rowSpan={2}>이름</StyledTableCell>
              <StyledTableCell style={{fontSize: 14, fontWeight: 400}} align='center' rowSpan={2}>권한</StyledTableCell>
              <StyledTableCell style={{fontSize: 14, fontWeight: 400}} align='center' colSpan={2}>시간</StyledTableCell>
              <StyledTableCell style={{fontSize: 14, fontWeight: 600, color: "yellow"}} align='center' rowSpan={2}>수정</StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell style={{fontSize: 14, fontWeight: 400}} align='center' >출</StyledTableCell>
              <StyledTableCell style={{fontSize: 14, fontWeight: 400}} align='center' >퇴</StyledTableCell>
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
                    cell3 = {item.in}
                    cell4 = {item.out}
                    getDataRefresh={getUserList}
                    editCase={editCase}
                    />
                  );    // return ----------
              })
            }
          </TableBody>
        </Table>
      </Card>}  


      {/* 월별 출근현황 */}
      {openMonthData && <DashBoard2 YearAndMonth={haveMonth[0]}/>}


      {/* 추가 메뉴 */}






    </>
  )
}

export default AdminPage