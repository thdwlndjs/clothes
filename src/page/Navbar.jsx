import React, { useState } from 'react'
import Login from './Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'



const Navbar = () => {
  const menuList = ['Outer', 'Top', 'Bottoms', 'ACC', 'Shoes', 'Login']
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
              onClick={menu === 'Login' ? openModal : undefined}
              style={{ cursor: menu === 'Login' ? 'pointer' : 'default' }}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>

      {/* 모달 UI */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
            <Login />
          </div>
      )}
    </div>
  )
}

export default Navbar
