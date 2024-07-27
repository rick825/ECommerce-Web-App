import React, { useEffect } from 'react'
import './Header.css'
import { useAdminContext } from '../../../../context/AdminContext'

const HeaderAdmin = () => {
 
  const {logout,adminData,admin} = useAdminContext();

  const handleLogout = () =>{
    logout();
  }
 
  return (
    <div className="admin-top admin-cont">
    <h2>Hello {admin ? adminData.admin.name : 'Please Login'}</h2>
    <div className="navigation">
       <ul>
           <li><a href="/admin">Home</a></li>
           <li><a href="/about">About</a></li>
           <li><a href="/help">Help</a></li>
           <li><a href onClick={handleLogout}>Logout</a></li>
       </ul>
    </div>
  </div>
  )
}

export default HeaderAdmin