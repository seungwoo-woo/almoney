import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GotoWork from './GotoWork';
import SignIn from './SignIn';
import SignUp from './SignUp';
import DashBoard from './DashBoard';
import { useState } from 'react';
import { UserCompanyContext } from './context/UserCompanyContext';
import { UserNameContext } from './context/UserNameContext';
import { UserGradeContext } from './context/UserGradeContext';
import AdminPage from './AdminPage';


function App() {

  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1);
  const YearAndMonth = year + month;
  
  const [ userCompany, setUserCompany ] = useState(null);
  const [ userName, setUserName ] = useState(null);
  const [ userGrade, setUserGrade ] = useState(null);

  return (
    <>
      <UserCompanyContext.Provider value={{userCompany, setUserCompany}}>
      <UserNameContext.Provider value={{userName, setUserName}}>
      <UserGradeContext.Provider value={{userGrade, setUserGrade}}>
        <Router>
          <Routes> 
            <Route path = "/" element={<SignIn />} />
            <Route path = "/gotoWork" element={<GotoWork />} />
            <Route path = "/signUp" element={<SignUp />} />
            <Route path = "/dashBoard" element={<DashBoard YearAndMonth={YearAndMonth}/>} />
            <Route path = "/admin" element={<AdminPage />} /> 
          </Routes>
        </Router>
      </UserGradeContext.Provider>
      </UserNameContext.Provider>
      </UserCompanyContext.Provider>
    </>
  );
}

export default App;
