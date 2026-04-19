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
import EssayCheck from './components/EssayCheck/EssayCheck.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Premium from './components/Premium/Premium.jsx';
import NotFound from './components/Notfound/Notfound.jsx';
import UniversityDetail from './components/Universitydetail/Universitydetail.jsx';
import OpportunityDetail from './components/Opportunitydetail/Opportunitydetail.jsx';

function App() {
  const [page, setPage] = useState("welcome");
  const [prevPage, setPrevPage] = useState("dashboard");
  const [selectedUniId, setSelectedUniId] = useState(null);
  const [selectedOppId, setSelectedOppId] = useState(null);

  const handleNavigate = (p, id) => {
    if (p === "back") {
      setPage(prevPage);
      return;
    }

    // Страницы с ID
    if (p === "uni-detail" && id) {
      setSelectedUniId(id);
    }
    if (p === "opp-detail" && id) {
      setSelectedOppId(id);
    }

    setPrevPage(page);
    setPage(p);
  };

  return (
    <div>
      {page === "welcome"       && <WelcomPage         onNavigate={handleNavigate} />}
      {page === "register"      && <Register           onNavigate={handleNavigate} />}
      {page === "login"         && <LogIn              onNavigate={handleNavigate} />}
      {page === "description"   && <Description        onNavigate={handleNavigate} />}
      {page === "dashboard"     && <Dashboard          onNavigate={handleNavigate} />}
      {page === "home"          && <Home               onNavigate={handleNavigate} />}
      {page === "profile"       && <Profile            onNavigate={handleNavigate} />}
      {page === "opportunities" && <Opportunities      onNavigate={handleNavigate} />}
      {page === "essay"         && <EssayCheck         onNavigate={handleNavigate} />}
      {page === "premium"       && <Premium            onNavigate={handleNavigate} />}
      {page === "uni-detail"    && <UniversityDetail   uniId={selectedUniId} onNavigate={handleNavigate} />}
      {page === "opp-detail"    && <OpportunityDetail  oppId={selectedOppId}  onNavigate={handleNavigate} />}
      {page === "not-found"     && <NotFound           onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;