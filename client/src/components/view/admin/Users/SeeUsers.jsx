import React, { useEffect } from 'react'
import Navigation from '../navigation/Navigation'
import { useAdminContext } from '../../../../context/AdminContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SeeUsers = () => {

    const {userList,setUserList,setSeeUser} = useAdminContext();

    const navigate = useNavigate();

    const handleNavigation = (value,prod)=>{
        setSeeUser(prod)
        navigate(value);
    }


    useEffect(()=>{
     handleGetUsers();
    },[])

    const handleGetUsers = async() =>{
        try {
            const response = await axios.get('/getUsers')
            if(response.status === 200){
              setUserList(response.data.users);
            }
        } catch (error) {
            console.log("Error while getting users",error);
            toast.error("Error while getting users");
        }
    }

  return (
    <div className='seeUsers'>
        <div className="seeproducttop add-btn-div">
        <Navigation />
      </div>
      <div className="seeCategoryBottom">
        <div className="main-table">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList && userList.length > 0 ? (
                userList.map((prod) => (
                  <tr key={prod.email}>
                    <td>{prod.fname} {prod.lname}</td>
                    <td>{prod.mobilenumber}</td>
                    <td>{prod.email}</td>
                    <td className='tableBtnMain'>
                      <button className='tableBtn' onClick={()=>handleNavigation('/admin/seeUserInfo',prod)}> See User & Orders</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SeeUsers