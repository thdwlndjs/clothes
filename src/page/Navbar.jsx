import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const menuList = ['Outer', 'Top', 'Bottoms', 'ACC', 'Shoes', 'Logout']

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('로그아웃 성공');
        window.location.href = '/';  // 로그아웃 후 메인(또는 첫 페이지)로 이동
      })
      .catch((error) => {
        console.error('로그아웃 실패', error);
      });
  }

  return (
    <div>
      <div className='menu-area'>
        <ul className='menu-list'>
          {menuList.map((menu, index) => (
            <li
              key={index}
              onClick={menu === 'Logout' ? handleLogout : undefined}
              style={{ cursor: menu === 'Logout' ? 'pointer' : 'default' }}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>

      
    </div>
  )
}

export default Navbar
