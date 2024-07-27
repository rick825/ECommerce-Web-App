import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from '../view/Header/Header';
import Main from '../view/Main';
import Login from '../view/Registration/Login';
import Signup from '../view/Registration/Signup';
import { useLoginStatus } from '../../context/LoginContext';
import '../assets/styles/Style.css';
import '../assets/styles/mobile.css';
import Categories from '../view/categories/Categories';
import Product from '../view/product/Product';
import Bag from '../view/bag/Bag';
import Wishlist from '../view/wishlist/Wishlist';
import AdminLogin from '../view/admin/login/AdminLogin';
import { useAdminContext } from '../../context/AdminContext';
import Admin from '../view/admin/home/Admin';
import SeeCategories from '../view/admin/categories/SeeCategories';
import SeeProduct from '../view/admin/product/SeeProduct';
import HeaderAdmin from '../view/admin/header/HeaderAdmin';
import Seeadmin from '../view/admin/home/Seeadmin';
import EditSeeProduct from '../view/admin/product/EditSeeProduct';
import SeeUsers from '../view/admin/Users/SeeUsers';
import User  from '../view/admin/Users/User';
import Profile from '../view/profile/Profile';

const Container = () => {
  const { loggedIn, setLoggedIn } = useLoginStatus();
  const {admin} = useAdminContext();
  const location = useLocation();


  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className='Presentation'>
      {!isAdminRoute ? <Header /> : <HeaderAdmin />}
      <Routes>
        <Route exact path="/" element={<Main loggedin={loggedIn} />} />
        {admin ? <Route exact path="/admin" element={<Admin />} /> : <Route exact path="/admin" element={<AdminLogin />} /> }
        <Route exact path="/admin/seeAdmins" element={admin ? <Seeadmin /> : <AdminLogin />} />
        <Route exact path="/admin/seeCategories" element={admin ? <SeeCategories />: <AdminLogin />} />
        <Route exact path="/admin/seeProduct" element={admin ? <SeeProduct /> : <AdminLogin />} />
        <Route exact path="/admin/editProduct" element={admin ? <EditSeeProduct /> : <AdminLogin />} />
        <Route exact path="/admin/seeUsers" element={admin ? <SeeUsers /> : <AdminLogin />}/>
        <Route exact path='/admin/seeUserInfo' element={admin ? <User /> : <AdminLogin />} />
        <Route exact path="/home" element={<Main loggedin={loggedIn} />} />
        <Route exact path="/bag" element={<Bag />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/wishlist" element={<Wishlist />} />
        <Route exact path="/category/:name" element={<Categories />} />
        <Route exact path="/product" element={<Product />} />
        <Route exact path="/signup" element={<Signup setLoggedIn={setLoggedIn} />} />
        <Route exact path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <Container />
  </Router>
);

export default AppWrapper;
