// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import FirstNav from './page/FirstNav';
import Navbar from './page/Navbar';
import Home from './page/home';
import './App.css';

function RequireAuth({ auth }) {
  if (auth.loading) return null; // 또는 로딩 UI
  if (!auth.loggedIn) return <Navigate to="/" replace />;
  return <Outlet />;
}

function PublicOnly({ auth }) {
  if (auth.loading) return null;
  if (auth.loggedIn) return <Navigate to="/Home" replace />;
  return <Outlet />;
}

export default function App() {
  const [auth, setAuth] = useState({ loading: true, loggedIn: false });

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch('/api/auth/status', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        });

        // 401/403이면 로그인 아님으로 처리
        if (!res.ok) {
          setAuth({ loading: false, loggedIn: false });
          return;
        }

        const data = await res.json();
        setAuth({ loading: false, loggedIn: !!data.loggedIn });
      } catch (e) {
        if (e.name === 'AbortError') return;
        setAuth({ loading: false, loggedIn: false });
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <Router>
      <Routes>
        {/* 비로그인 전용 */}
        <Route element={<PublicOnly auth={auth} />}>
          <Route path="/" element={<FirstNav />} />
        </Route>

        {/* 로그인 사용자 전용 */}
        <Route element={<RequireAuth auth={auth} />}>
          <Route path="/Home" element={<><Navbar /><Home /></>} />
          <Route path="/Home/:category" element={<><Navbar /><Home /></>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}
