import React, { useEffect, useState, useContext } from 'react'
import { UserNameContext } from './context/UserNameContext';
import { UserGradeContext } from './context/UserGradeContext';
import { useNavigate } from 'react-router-dom';
import ResponsiveAppBar from './ResponsiveAppBar'


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


function AdminPage() {

  const navigate = useNavigate();
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



  return (
    <>
      <ResponsiveAppBar />
    </>
  )
}

export default AdminPage