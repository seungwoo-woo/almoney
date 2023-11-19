import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { Container } from '@mui/material';



// firebase import=======================================================
import { firebaseConfig } from './Firebase.js';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Timestamp, getFirestore, collection, addDoc, getDoc, doc, updateDoc, setDoc, query, where, orderBy} from "firebase/firestore";



// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



function GotoWork() {

  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1);
  const date = String(today.getDate());
  const YearAndMonth = year + month;


  // useEffect Start -------------------------------------------------------------------

  useEffect(()=> {

    const getDailyData = async () => {

      const querySnapshot = await getDoc(doc(db, "HeeNWoo", YearAndMonth));

      if (!querySnapshot.exists()) {
        await setDoc(doc(db, "HeeNWoo", YearAndMonth),{
          [date]: []
        });
      } else {
        const keys = Object.keys(querySnapshot.data())
        if (!keys.includes(date)) {
          await setDoc(doc(db, "HeeNWoo", YearAndMonth),{
            ...querySnapshot.data(), [date]: []
          });
        }
      }
    } // function End --------------------------------------------------

    getDailyData()

  }, []) 
// useEffect End -------------------------------------------------------------------


  const writeDailyDataIn = async () => {

    var dailyDataCopy = []
    const addData = {name: '우현건', in: Timestamp.fromDate(new Date()), out: ""};

    const querySnapshot = await getDoc(doc(db, "HeeNWoo", YearAndMonth));
    dailyDataCopy = querySnapshot.data()[date];      
    dailyDataCopy.push(addData);

    await updateDoc(doc(db, "HeeNWoo", YearAndMonth), {
      [date]: dailyDataCopy  
    })

  } // function End --------------------------------------------------


  const writeDailyDataOut = async () => {

    var dailyDataCopy = []

    const querySnapshot = await getDoc(doc(db, "HeeNWoo", YearAndMonth));
    dailyDataCopy = querySnapshot.data()[date];

    for (let i = 0; i < dailyDataCopy.length; i++ ) {
      if (dailyDataCopy[i]['name'] === '우승우') {
        dailyDataCopy[i]['out'] = Timestamp.fromDate(new Date())
      }
    }

    await updateDoc(doc(db, "HeeNWoo", YearAndMonth), {
      [date]: dailyDataCopy  
    })

  } // function End --------------------------------------------------


  return (
    <Container maxWidth='sm'>      
      <Button variant="contained" size='large' onClick={writeDailyDataIn} > 출근 </Button>
      <Button variant="contained" size='large' onClick={writeDailyDataOut} > 퇴근 </Button>
    </Container>
  )

} // Function End ==========================================================================

export default GotoWork