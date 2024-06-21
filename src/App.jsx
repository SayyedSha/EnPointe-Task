// import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout';
import Login from './components/pages/LoginPage';
import UserPage from './components/pages/UserPage';

import {Routes, Route, BrowserRouter} from "react-router-dom"
import Dashboard from './components/pages/dashboard';

import Profile from './components/pages/Profile';

function App() {
  return (
    
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route element={<Layout/>}>
              <Route path="user" element={<UserPage />}/>
              <Route path="dashboard" element={<Dashboard />}/>
              <Route path="profile" element={<Profile />}/>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </>
   
  );
}

export default App;
