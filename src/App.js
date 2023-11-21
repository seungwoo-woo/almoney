import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GotoWork from './GotoWork';
import MyGeo from './MyGeo';
import SignIn from './SignIn';
import SignUp from './SignUp';
import DashBoard from './DashBoard';
import { useState } from 'react';
import { UserNameContext } from './context/UserNameContext';
import { UserGradeContext } from './context/UserGradeContext';



function App() {

  const [ userName, setUserName ] = useState(null);
  const [ userGrade, setUserGrade ] = useState(null);

  return (

    <UserNameContext.Provider value={{userName, setUserName}}>
    <UserGradeContext.Provider value={{userGrade, setUserGrade}}>   
      <Router>
        <Routes>
          <Route path = "/" element={<SignIn />} />
          <Route path = "/gotoWork" element={<GotoWork />} />
          <Route path = "/signUp" element={<SignUp />} />
          <Route path = "/dashBoard" element={<DashBoard />} />
          {/*<Route path = "/openPhoneList" element={<OpenPhoneList />} />
          <Route path = "/calculate" element={<OpenPhoneCaculation />} />
          <Route path = "/admin" element={<AdminPage />} /> */}
        </Routes>
      </Router>
    </UserGradeContext.Provider>
    </UserNameContext.Provider>
    


    // <div className="App">
      // <AppShell/>
      
      // {/* <MyGeo /> */}
    // </div>
  );
}

export default App;
