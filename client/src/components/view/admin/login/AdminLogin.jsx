import React, { useState } from 'react'
import './AdminLogin.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAdminContext } from '../../../../context/AdminContext';


const AdminLogin = () => {

  const [formData,setFormData] =  useState(
    {
      email: '',
      password: ''
    }
  );

  const {setAdmin,setAdminData} = useAdminContext();

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

 
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post('/api/adminLogin', formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        const loggedInData = {
          admin: response.data.admin,
          token: response.data.token
        }
        setAdminData(loggedInData);
        toast.success(`Login Successful: Welcome ${loggedInData.admin.name}`);
      } else if (response.status === 400) {
        toast.warning(`Login Failed! ${response.data.message}`);
      } else {
        toast.error("Login Failed");
      }
    } catch (error) {
      console.log("Error while Logging In", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("Error While Logging In");
      }
    }
  };

  return (
    <div className='adminLogin'>
      <div className="login_container">
         <div className="loginTop">
            <h2>Admin Login</h2>
         </div>
         <div className="loginBottom">
            <form onSubmit={handleSubmit} >
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="
                emailHelp" placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="
                Password" name="password" value={formData.password} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
         </div>
      </div>
    </div>
  )
}

export default AdminLogin