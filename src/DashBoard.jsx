import React, { useEffect, useState, useContext } from 'react'
import { UserNameContext } from './context/UserNameContext';
import { UserGradeContext } from './context/UserGradeContext';
import { useNavigate } from 'react-router-dom';
import Cell from './Cell.jsx';
import ResponsiveAppBar from './ResponsiveAppBar.jsx';


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



function DashBoard() {

  const navigate = useNavigate();

  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1);
  const date = String(today.getDate());
  const YearAndMonth = year + month;

  const [ goToWorkData, setGoToWorkData ] = useState([]);

  const { setUserName } = useContext(UserNameContext);
  const { setUserGrade }= useContext(UserGradeContext);



// useEffect 1 Start ========================================================
  useEffect(()=>{

  const getUserInformation = () => {    

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      let userName = '';
      let userGrade = '';
      const querySnapshot = await getDocs(query(collection(db, "HeeNWoo"), where("id", "==", user.uid)));
      querySnapshot.forEach((doc) => {
      userName = (doc.data().name);
      userGrade = (doc.data().userGrade);
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

      let tempArray = []  
      const querySnapshot = await getDoc(doc(db, "HeeNWoo", YearAndMonth));

      for(let i = 1 ;  i <=31; i++) {
        tempArray.push(querySnapshot.data()[i])}

      setGoToWorkData(tempArray);  
    } // function End --------------------------------------------------

    getDailyData()

  }, []) 
// useEffect End -------------------------------------------------------------------


  return (
    <>
    <ResponsiveAppBar />
    {goToWorkData ? goToWorkData.map((d, index) => (

      (d ? <Cell dailyData = {d} date = {index+1} /> : "")

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