import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { Container, Stack } from '@mui/material';


// firebase import=======================================================
import { firebaseConfig } from './Firebase.js';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Timestamp, getFirestore, collection, addDoc, getDoc, doc, updateDoc, setDoc, query, where, orderBy} from "firebase/firestore";


// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Function Start =======================================================================

function GotoWork() {

  var isGotoWorkTime = false;
  var isWorkTime = false;
  var isGooutWorkTime = false;
  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1);
  const date = String(today.getDate());
  const YearAndMonth = year + month;
  const hours = Number(today.getHours());
  const minutes = Number(today.getMinutes());

  if (1 <= hours && 9 >= hours) {
    isGotoWorkTime = true;
  }

  if (17 <= hours && 24 >= hours) {
    isGooutWorkTime = true;
  }

  if (9 < hours && 17 > hours) {
    isWorkTime = true;
  }


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

// 출근 ----------------------------------------------------------------------------
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


// 퇴근 ----------------------------------------------------------------------------
  const writeDailyDataOut = async () => {

    var dailyDataCopy = []

    const querySnapshot = await getDoc(doc(db, "HeeNWoo", YearAndMonth));
    dailyDataCopy = querySnapshot.data()[date];

    for (let i = 0; i < dailyDataCopy.length; i++ ) {
      if (dailyDataCopy[i]['name'] === '우현건') {
        dailyDataCopy[i]['out'] = Timestamp.fromDate(new Date())
      }
    }

    await updateDoc(doc(db, "HeeNWoo", YearAndMonth), {
      [date]: dailyDataCopy  
    })

  } // function End --------------------------------------------------



  return (
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
      </Stack>
      }
    </Container>
  )

} // Function End ==========================================================================

export default GotoWork