import React, { useEffect, useState } from 'react'


// firebase import=======================================================
import { firebaseConfig } from './Firebase.js';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Timestamp, getFirestore, collection, addDoc, getDoc, doc, updateDoc, setDoc, query, where, orderBy} from "firebase/firestore";



// Initialize Firebase ==================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);




function DashBoard() {

  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1);
  const date = String(today.getDate());
  const YearAndMonth = year + month;

  const [ goToWorkData, setGoToWorkData ] = useState([]);



    // useEffect Start -------------------------------------------------------------------

    useEffect(()=> {

      const getDailyData = async () => {

        let tempArray = []
  
        const querySnapshot = await getDoc(doc(db, "HeeNWoo", YearAndMonth));

        for(let i = 1 ;  i <=21; i++) {
          tempArray.push(querySnapshot.data()[i])}

        setGoToWorkData(tempArray);
  
      } // function End --------------------------------------------------
  
      getDailyData()
  
    }, []) 
  // useEffect End -------------------------------------------------------------------

  console.log(goToWorkData);


  return (
    <>
    {goToWorkData ? goToWorkData.map(d => (

      (d ? d.map((i) => {
              return (
                <>
                <div>{(new Date(i['in']['seconds']*1000)).toLocaleString()}</div>
                <div>{i['name']}</div>
                </>)
            }): "")
    )
    )      
  : ""}
    </>
  )
}

export default DashBoard