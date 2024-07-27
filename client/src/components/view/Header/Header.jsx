import React, { useEffect } from 'react';
import './Header.css';
import '../../assets/styles/Style.css';
import { useLoginStatus } from '../../../context/LoginContext';
import { useLocalProvider } from '../../../context/LocalContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Header = () => {
  const { loggedIn,setLoggedInUser, setLoggedIn } = useLoginStatus();
  const { bag, wishlist } = useLocalProvider();
  const navigate = useNavigate();

  //handle Navigation
  const handleNavigation = (value) =>{
    navigate(`${value}`);
  }

  //handle logout
  const handleLogout = async ()=>{
    try {
      const response = await axios.get('/api/logout')
    if(response.status === 200){
      setLoggedInUser('');
      setLoggedIn(false);
      toast.success("Logout Successfully!!");
    }else{
      toast.error("Logout Unsuccessfully!!")
    }
    } catch (error) {
      console.log("Error while Logout",error);
      toast.error("Error while Logout");
    }
  }

  return (
    <div className="nav">
      <div className="navleft">
        <div className="navlogo">
          <a href="/">
            <h2>ECommerce App</h2>
          </a>
        </div>
      </div>
      <div className="navmid">
        <input type="text" placeholder='Search For Items' />
        <button>
          <img src="https://img.icons8.com/ios/50/search--v1.png" alt="search--v1" />
        </button>
      </div>
      <div className="navright">
        <div className="navlist">
          {loggedIn && (
            <ul>
              <li className="navitem">
                <a href onClick={()=>handleNavigation('/home')} className="navlink">
                  <img src="https://img.icons8.com/sf-regular/48/home-page.png" alt="home-page" />
                </a>
              </li>
              <li className="navitem">
                <a href onClick={()=>handleNavigation('/wishlist')} className="navlink">
                  <img src="https://img.icons8.com/windows/32/like--v1.png" alt="wishlist" />
                  <p>{wishlist.length > 0 ? wishlist.length : 0}</p>

                </a>
              </li>
              <li className="navitem">
                <a href onClick={()=>handleNavigation('/bag')} className="navlink">
                  <img src="https://img.icons8.com/ios/50/shopping-bag--v1.png" alt="cart" />
                  <p>{bag.length > 0 ? bag.length : 0}</p>
                </a>
              </li>
              <li className="navitem">
                <a href onClick={()=>handleNavigation('/profile')} className="navlink">
                  <img src="https://img.icons8.com/windows/32/000000/user-male-circle.png" alt="user-male-circle" />
                </a>
              </li>
              <li className="navitem" onClick={handleLogout}>
                <a href className="navlink">
                  <img src="https://img.icons8.com/ios/50/exit--v1.png" alt="settings--v1" />
                </a>
              </li>
            </ul>
          )}
          {!loggedIn && (
            <ul className='notlogin'>
              <li className="navitem">
                <a href onClick={()=>handleNavigation('/home')} className="navlink">
                  <img src="https://img.icons8.com/sf-regular/48/home-page.png" alt="home-page" />
                </a>
              </li>
              <li className="navitem">
                <a href onClick={()=>handleNavigation('/wishlist')} className="navlink">
                  <img src="https://img.icons8.com/windows/32/like--v1.png" alt="wishlist" />
                  <p>{wishlist.length > 0 ? wishlist.length : 0}</p>

                </a>
              </li>
              <li className="navitem">
                <a href onClick={()=>handleNavigation('/bag')} className="navlink">
                  <img src="https://img.icons8.com/ios/50/shopping-bag--v1.png" alt="cart" />
                  <p>{bag.length > 0 ? bag.length : 0}</p>
                </a>
              </li>
              <li className="navitem">
                <a href="/signup" className="navlink signup">
                  Signup
                </a>
              </li>
              <li className="navitem">
                <a href="/login" className="navlink login">
                  Login
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
