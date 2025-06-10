import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const menuList = ['Outer', 'Top', 'Bottoms', 'ACC', 'Shoes', 'Logout'];
  const navigate = useNavigate();


  const handleClick = (menu) => {
    if (menu === 'Logout') {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          console.log('로그아웃 성공');
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('로그아웃 실패', error);
        });
    } else {
      navigate(`/home/${encodeURIComponent(menu)}`);
    }
  };

  return (
    <div>
      <div className='menu-area'>
        <ul className='menu-list'>
          {menuList.map((menu, index) => (
                   <li key={index} onClick={() => handleClick(menu)}>
              {menu}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
