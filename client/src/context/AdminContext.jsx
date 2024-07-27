import React, { useState, createContext, useContext, useEffect } from 'react';
import { isTokenExpired } from '../utils/auth';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(false);
  const [explore, setExplore] = useState([
    { id: 1, name: "New Arivals" },
    { id: 2, name: "Trending" },
    { id: 3, name: "Best Selling" },
    { id: 4, name: "Top Rated" },
  ]);

  const [homeData, setHomeData] = useState([
    {
      name: 'Admin',
      homemidtopimage:
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      MidBot1:
        'https://images.unsplash.com/photo-1482304651556-cb27a6fb596a?q=80&w=2016&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      MidBot2:
        'https://images.unsplash.com/photo-1462392246754-28dfa2df8e6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      MidBot3:
        'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ]);

  //common getting data from storage
  const getItemFromStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage`, error);
      return defaultValue;
    }
  };


  const [adminData, setAdminData] =  useState(()=>getItemFromStorage('admin',''))
  const [adminList,setAdminList] = useState(()=>getItemFromStorage('adminList',[]));
  const [categories, setCategories] = useState(()=>getItemFromStorage('categories',[]));
  const [seeProduct, setSeeProduct] = useState(()=>getItemFromStorage('productList',[]));
  const [userList, setUserList] = useState(()=>getItemFromStorage('userList',[]));
  const [orderList, setOrderList] = useState(()=>getItemFromStorage('orderList',[]));
  const [seeUser, setSeeUser] = useState(()=>getItemFromStorage('seeUser',''));

  //set see user to local storage
  useEffect(()=>{
   localStorage.setItem('seeUser',JSON.stringify(seeUser));
  },[seeUser])
  //set order to local storage
  useEffect(()=>{
   localStorage.setItem('orderList',JSON.stringify(orderList));
  },[orderList])

  //set userlist to local storage
  useEffect(()=>{
    localStorage.setItem('userList',JSON.stringify(userList))
  },[userList])
  
  //set product to Local Storage
  useEffect(()=>{
     localStorage.setItem('productList',JSON.stringify(seeProduct));
  },[seeProduct])

  //set Categories List to Local Storage
  useEffect(()=>{
    localStorage.setItem('categories',JSON.stringify(categories));
  },[categories])

  //set admin list to local storage
  useEffect(() => {
    localStorage.setItem('adminList', JSON.stringify(adminData));
    }, [adminData]);


  //admin logout
  const logout = () => {
    setAdmin(false);
    setAdminData(null);
    localStorage.removeItem('admin');
    toast.success("Logged Out Successfully!!");
  };

  //set admin to local storage
  useEffect(() => {
    localStorage.setItem("admin", JSON.stringify(adminData));
    if (adminData && adminData.token) {
      if (isTokenExpired(adminData.token)) {
        logout();
      } else {
        setAdmin(true);
      }
    }
  }, [adminData]);

  //interval for logging out admin
  useEffect(() => {
    const interval = setInterval(() => {
      if (adminData && adminData.token && isTokenExpired(adminData.token)) {
        logout();
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [adminData]);

  return (
    <AdminContext.Provider value={{ admin, setAdmin, homeData, setHomeData, categories, setCategories, explore, setExplore, adminData, setAdminData, logout,adminList,setAdminList,seeProduct,setSeeProduct,userList, setUserList,orderList, setOrderList,seeUser, setSeeUser}}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
