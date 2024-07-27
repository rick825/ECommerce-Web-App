import React, { useState } from 'react';
import './admin.css';
import { useNavigate } from 'react-router-dom';
import CreateAdmin from './CreateAdmin';
import { useAdminContext } from '../../../../context/AdminContext';
import { toast } from 'react-toastify';

const Admin = () => {
  const [adminForm, setAdminForm] = useState(false);
  const { adminData } = useAdminContext();
  const navigate = useNavigate();

  const handleNavigation = (value) => {
    navigate(value);
  }

  const handleCreateAdmin = () => {
    console.log("adminData-->",adminData.admin.role);
    if(adminData.admin.role === 'all'){
        setAdminForm(true);
    }else{
        toast.warning("Your are not allowed for this function!!");
    }
  }

  return (
    <div className='admin'>
      {adminForm && <CreateAdmin setAdminForm={setAdminForm} />}
      <div className="admin-bot admin-cont">
        <div className="admin-button">
          <button className="admin-button2" onClick={handleCreateAdmin}>Create Admin</button>
          <button className="admin-button2" onClick={() => handleNavigation('/admin/seeAdmins')}>See Admins</button>
          <button className='admin-button3' onClick={() => handleNavigation('/admin/seeCategories')}>See Categories</button>
          <button className='admin-button4' onClick={() => handleNavigation('/admin/seeProduct')}>See Products</button>
          <button className="admin-button5"  onClick={() => handleNavigation('/admin/seeUsers')}>See Users</button>
          <button className="admin-button6">See Orders</button>
        </div>
      </div>
    </div>
  )
}

export default Admin;