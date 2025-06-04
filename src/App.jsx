import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FirstNav from './FirstNav';
import Main from './page/Main';
import Navbar from './Navbar';


function App() {
  const isLoginPage = location.pathname === '/';

  return (

    <Router>
      <Routes>
        <Route path="/" element={<FirstNav />} />
        <Route path="/main" element={<><Navbar /><Main /></>} /> {/* Main에서만 Navbar 표시 */}
      </Routes>
    </Router>

  );
}

export default App;
