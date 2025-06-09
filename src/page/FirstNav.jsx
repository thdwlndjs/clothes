import React, { useState } from 'react';
import Login from './Login';
import Signin from './Signin'; 

import './FirstNav.css';

function FirstNav() {
  const menuList = ['Log in', 'Sign in'];
  const [modalType, setModalType] = useState(null); // 'login' | 'signin'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuClick = (menu) => {
    if (menu === 'Log in') {
      setModalType('login');
    } else if (menu === 'Sign in') {
      setModalType('signin');
    }
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="menu-area">
        <ul className="menu-list">
          {menuList.map((menu, index) => (
            <li
              key={index}
              onClick={() => handleMenuClick(menu)}
              style={{
                cursor: ['Log in', 'Sign in'].includes(menu) ? 'pointer' : 'default',
              }}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          {modalType === 'login' && <Login />}
          {modalType === 'signin' && <Signin />}
        </div>
      )}
    </div>
  );
}

export default FirstNav;
