import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import FirstNav from './page/FirstNav';
import Home from './page/Home';
import Navbar from './page/Navbar';

import './App.css';


const AuthRoute = ({ requireAuth, children }) => {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!checked) return null; // or 로딩 UI

  if (requireAuth && !user) {
    // 로그인 필요, 근데 로그인 안 된 경우
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && user) {
    // 비로그인 필요, 근데 로그인 된 경우
    return <Navigate to="/Home" replace />;
  }

  return children;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute requireAuth={false}>
              <FirstNav />
            </AuthRoute>
          }
        />

        {/* 로그인 한 사용자만 접근 가능 */}
        <Route
          path="/Home"
          element={
            <AuthRoute requireAuth={true}>
              <Navbar />
              <Home />
            </AuthRoute>
          }
        />
        {/* 로그인한 사용자만 접근 가능한 라우트 (카테고리 필터 포함) */}
        <Route
          path="/Home/:category"
          element={
            <AuthRoute requireAuth={true}>
              <Navbar />
              <Home />
            </AuthRoute>
          }
        />
        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
