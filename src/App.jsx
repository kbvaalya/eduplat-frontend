import React from 'react';
import './App.css';
import { useState } from "react";
import WelcomPage from './components/WelcomePage/WelcomPage.jsx';
import Register from './components/Register/Register.jsx';
import LogIn from './components/LogIn/LogIn.jsx';
import Home from './components/Home/Home.jsx';
import Description from './components/Register/Description/description.jsx';
import Profile from './components/Profile/Profile.jsx';
import Opportunities from './components/Opportunities/Opportunities.jsx';

function App() {
  const [page, setPage] = useState("welcome");

  const handleNavigate = (p) => {
    if (p === "back") setPage("welcome");
    else setPage(p);
  };

  return (
    <div>
      {page === "welcome"     && <WelcomPage   onNavigate={handleNavigate} />}
      {page === "register"    && <Register     onNavigate={handleNavigate} />}
      {page === "login"       && <LogIn        onNavigate={handleNavigate} />}
      {page === "description" && <Description  onNavigate={handleNavigate} />}
      {page === "home"        && <Home         onNavigate={handleNavigate} />}
      {page === "profile" && <Profile onNavigate={handleNavigate} />}
      {page === "opportunities" && <Opportunities onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;