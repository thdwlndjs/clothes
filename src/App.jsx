import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import FirstNav from './FirstNav'
import ProductAll from './page/ProductAll';
import Login from './page/Login';
import ProductPage from './page/ProductPage';
import Navbar from './Navbar';
import Text from './page/Text';


function App() {
  const isLoginPage = location.pathname === '/';

  return (

    <div>
      {!isLoginPage && <Navbar />}
      <Router>
        <Routes>
          <Route path="/" element={<FirstNav />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productall" element={<ProductAll />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/text" element={<Text />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
