import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './AppShell';
import GotoWork from './GotoWork';
import MyGeo from './MyGeo';
import SignIn from './SignIn';
import SignUp from './SignUp';
import DashBoard from './DashBoard';





function App() {
  return (

    <Router>
      <Routes>
        <Route path = "/" element={<SignIn />} />
        <Route path = "/GotoWork" element={<GotoWork />} />
        <Route path = "/signUp" element={<SignUp />} />
        <Route path = "/dashBoard" element={<DashBoard />} />
        {/*<Route path = "/openPhoneList" element={<OpenPhoneList />} />
        <Route path = "/calculate" element={<OpenPhoneCaculation />} />
        <Route path = "/admin" element={<AdminPage />} /> */}
      </Routes>
    </Router>


    // <div className="App">
      // <AppShell/>
      
      // {/* <MyGeo /> */}
    // </div>
  );
}

export default App;
