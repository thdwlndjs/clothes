import React, { useState } from 'react'
import Login from './page/Login';
import Signin from './page/Signin'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'



const FirstNav = () => {
    const menuList = ['Log in', 'Sign in']
    const [modalType, setModalType] = useState(null); // null | 'login' | 'signin'

    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    return (
        <div>
            <div className='menu-area'>
                <ul className='menu-list'>
                    {menuList.map((menu, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                if (menu === 'Log in') {
                                  setModalType('login');
                                  setIsModalOpen(true);
                                } else if (menu === 'Sign in') {
                                  setModalType('signin');
                                  setIsModalOpen(true);
                                }
                              }}
                            style={{ cursor: menu === 'Log in' || menu === 'Sign in' ? 'pointer' : 'default' }}
                        >
                            {menu}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 모달 UI */}
            {isModalOpen && (
                <div className="modal-overlay">
                    {modalType === 'login' && <Login />}
                    {modalType === 'signin' && <Signin />}
                </div>
            )}
        </div>
    )
}

export default FirstNav
