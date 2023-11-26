import React, { useEffect, useState, useContext } from 'react'
import { UserCompanyContext } from './context/UserCompanyContext';
import { UserNameContext } from './context/UserNameContext';
import { UserGradeContext } from './context/UserGradeContext';
import { useNavigate } from 'react-router-dom';
import Cell from './Cell.jsx';


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



function DashBoard(props) {

  const { YearAndMonth, setExcelData } = props

  const year = YearAndMonth.substr(0, 4)
  const month = Number(YearAndMonth.substr(4,)) - 1

  const navigate = useNavigate();

  // const today = new Date();
  // const year = String(today.getFullYear());
  // const month = String(today.getMonth() + 1);
  // const date = String(today.getDate());
  // const YearAndMonth = year + month;

  const [ goToWorkData, setGoToWorkData ] = useState([]);
  const { userCompany, setUserCompany } = useContext(UserCompanyContext);
  const { setUserName } = useContext(UserNameContext);
  const { setUserGrade }= useContext(UserGradeContext);


// useEffect 1 Start User 정보 확인  ========================================================
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



  // useEffect Start 일간 출퇴근 기록 가져오기 -------------------------------------------------
  useEffect(()=> {

    const getDailyData = async () => {

      let tempArray = []  
      const querySnapshot = await getDoc(doc(db, userCompany, YearAndMonth));

      for(let i = 1 ;  i <=31; i++) {
        tempArray.push(querySnapshot.data()[i])}

      setGoToWorkData(tempArray);  
      setExcelData(tempArray)
    } // function End --------------------------------------------------

    if(userCompany) {
      getDailyData() }

  }, [userCompany]) 
// useEffect End -------------------------------------------------------------------


  return (
    <>
    {goToWorkData ? goToWorkData.map((d, index) => (

      (d ? <Cell dailyData = {d} date = {index+1}  year = {year} month = {month} /> : "")

      // (d ? d.map((i) => {
      //         return (
      //           <>
      //           <div>{(new Date(i['in']['seconds']*1000)).toLocaleString()}</div>
      //           <div>{i['name']}</div>
      //           </>)
      //       }): "")
    )
    )      
  : ""}
    </>

  )
}

export default DashBoard