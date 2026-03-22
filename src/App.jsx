import React from 'react';
import './App.css';
import { useState } from "react";
import WelcomPage from './components/WelcomePage/WelcomPage.jsx';
import Register from './components/Register/Register.jsx';
import LogIn from './components/LogIn/LogIn.jsx';
import Home from './components/Home/Home.jsx';

function App() {
  const [page, setPage] = useState("welcome");

  const handleNavigate = (p) => {
    if (p === "back") setPage("welcome");
    else setPage(p);
  };

  return (
    <div>
      {page === "welcome"  && <WelcomPage onNavigate={handleNavigate} />}
      {page === "register" && <Register  onNavigate={handleNavigate} />}
      {page === "login"    && <LogIn     onNavigate={handleNavigate} />}
      {page === "home"     && <Home />}
    </div>
  );
}

export default App;