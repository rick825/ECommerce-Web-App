import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {

    const navigate = useNavigate();

  const handleNavigation = (value) =>{
     navigate(value);
  }

  return (
    <div className='navigation'>
         <div className="admin-button">
            <button className='admin-button3' onClick={()=>handleNavigation('/admin/seeCategories')}>See Categories</button>
            <button className='admin-button4' onClick={()=>handleNavigation('/admin/seeProduct')}>See Products</button>
            <button className="admin-button5" onClick={()=>handleNavigation('/admin/seeUsers')}>See Users</button>
            <button className="admin-button6">See Orders</button>
         </div>
    </div>
  )
}

export default Navigation