import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      // 백엔드에서 JWT 토큰 내려줌
      const token = res.data.token;

      // 저장
      localStorage.setItem("token", token);

      setSuccessMsg("로그인 성공!");
      navigate('/productall');

    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setErrorMsg("로그인 실패. 서버를 확인하세요.");
      }
    }
  };

  return (
    <div className="login-box">
      <div className="content">
        <h1>로그인</h1>

        <form onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="PW"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button type="submit" className="login-button">로그인</button>
          </div>
        </form>

        {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: 'green', marginTop: '10px' }}>{successMsg}</p>}
      </div>
    </div>
  );
};

export default Login;
