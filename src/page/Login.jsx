import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

import './Login.css'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 메시지 상태
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();  // useNavigate 훅 사용

  const handleLogin = async (e) => {
    e.preventDefault(); // 페이지 리로드 방지
    setErrorMsg('');
    setSuccessMsg('');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // 성공 시
        setSuccessMsg("로그인에 성공했습니다!");
        console.log('로그인 성공:', userCredential.user);
        navigate('/productall'); // 메인 화면으로 이동
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
          setErrorMsg('등록되지 않은 이메일입니다.');
        } else if (error.code === 'auth/invalid-credential') {
          setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        else if (error.code === 'auth/missing-password') {
          setErrorMsg('비밀번호가 올바르지 않습니다.');
        } else {
          setErrorMsg(`로그인 실패: ${error.message}`);
        }
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('구글 로그인 성공:', user);
        navigate('/'); // 메인 화면으로 이동
      })
      .catch((error) => {
        console.error('구글 로그인 실패:', error.message);
      });
  };
  return (
    <div className="login-box">
      <div className="content">
        <h1>로그인</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username"></label>
            <input type="email" placeholder="ID" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password"></label>
            <input type="password" placeholder="PW" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <button type="submit" onClick={handleLogin} className="login-button">로그인</button>
          </div>
        </form>


        <div>
          <button onClick={handleGoogleLogin} className="G-login-button">
            <img className="google-Icon" src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo"/>
            구글 로그인</button>
        </div>
          {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>}
          {successMsg && <p style={{ color: 'green', marginTop: '10px' }}>{successMsg}</p>}
      </div>
    </div>
  );
};

export default Login; 
