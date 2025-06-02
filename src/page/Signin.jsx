import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';

import './Signin.css'

const Signin = () => {
    // 입력 상태 저장
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 메시지 상태
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault(); // 페이지 리로드 방지
        setErrorMsg('');
        setSuccessMsg('');

        try {
            // 회원가입 시도
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // 성공 시
            setSuccessMsg("회원가입에 성공했습니다!");
            console.log('회원가입된 유저:', userCredential.user);

            // 회원가입 후 할 작업 (예: 홈으로 이동) 가능
        } catch (error) {
            // 에러 처리
            if (error.code === 'auth/invalid-email') {
                setErrorMsg('잘못된 이메일 형식입니다.');
              } else


            setErrorMsg(error.message);
        }
    }
    return (
        <div className="signin-box">
            <div className="content">
                <h1>Sign in</h1>
                <form onSubmit={handleSignUp}>
                    <div>
                        <label htmlFor="username"></label>
                        <input type="text" id="username" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password"></label>
                        <input type="password" id="password" name="password" value={password} placeholder="비밀번호" onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div>
                        <button type="submit" className="login-button">시작하기</button>
                    </div>
                    {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>}
                    {successMsg && <p style={{ color: 'green', marginTop: '10px' }}>{successMsg}</p>}
                </form>

            </div>
        </div>
    );
};

export default Signin; 
