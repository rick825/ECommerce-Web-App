import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoginStatus } from '../../../context/LoginContext';

const Signup = ({setLoggedIn}) => {
  const navigate = useNavigate();
  const [otpInput,setOtpInput] = useState(false);
  const [otp, setOtp] = useState();
  const { setLoggedInUser}  = useLoginStatus();

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    mobilenumber: '',
    email: '',
    password: '',
    cpassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSendOtp = async (e) =>{
    e.preventDefault();
    try {

        const response = await axios.post('/api/verifyuser',{value: formData.email},{
          headers:{
            'Content-Type': 'application/json'
          }
        })

        if(response.status === 200){

          navigate('/login');
          toast.success("User already Exist! Kindly Login!");

        }else{

          console.log("Sending OTP to ",formData.email);
          const res = await axios.post('/api/sendOtp',{value:formData.email},{
          headers: {
            'Content-Type': 'application/json'
            }
          });
          if(res.status === 200){
          setOtp(res.data.otp);
          setOtpInput(true);
          toast.success(res.data.message);

        }else{

          toast.error("Error While Sending OTP")

        }  
      }

    } catch (error) {
      console.log("Error:",error);
      toast.error("Internal Server Error");
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
     if(formData.otp === otp){
          console.log("Form Data:", formData);
         const response = await axios.post('/api/signup',  formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        console.log("Signup successful");
        setLoggedInUser(response.data.user);
        setLoggedIn(true)
        navigate('/home');
        toast.success("Logged In");
      } else {
        toast.error("Error While Logging in");
        console.error('Signup failed');
      }
    }else{
      toast.error("OTP not Matching!!");
    }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  
  return (

    <div className="loginsec">
        
    <div className="leftlogin logs">
      <div className="llup">
        <h1><span>W</span>elcome,</h1>
        <h2>Kindly <span>Sign Up!!</span></h2>
      </div>
       <div className="lldown">
         <div className="lldown-box">
          <div className="ecchart ecm">
            <div className="ecc1 ecc">

            </div>
            <div className="ecc2 ecc">

            </div>
            <div className="ecc3 ecc">

            </div>
            <div className="ecc4 ecc">

            </div>
            <div className="ecc5 ecc">

            </div>
            <div className="ecc6 ecc">

            </div>
            <div className="ecc7 ecc">

            </div>
            <div className="ecc8 ecc">

            </div>
            <div className="ecc2 ecc">

            </div>
          </div>
         </div>
       </div>
    </div>
    <div className="rightlogin logs signup">
      <form onSubmit={handleSendOtp}  method="post" className="form">
         <label htmlFor="fname">First Name</label>
         <input type="text" name="fname" placeholder="Enter Your First Name" value={formData.fname} onChange={handleInputChange} required />
         <label htmlFor="lname">last Name</label>
         <input type="text" name="lname" placeholder="Enter Your last Name" value={formData.lname} onChange={handleInputChange} required />
         <label htmlFor="mobilenumber">Mobile Number</label>
         <input type="number" name="mobilenumber" placeholder="Enter Your Mobile Number" value={formData.mobilenumber} onChange={handleInputChange} required />
         <label htmlFor="email">Email</label>
         <input type="text" name="email" placeholder="Enter Your Email ID" value={formData.email} onChange={handleInputChange} required />
         <div className="alsign">
          <p>Not a User Please <Link className='regisbutton'  to="/login">Login</Link></p>
         </div>
       { !otpInput && <input type="submit" value="Submit" />}
         {otpInput && <form className="otp form">
         <label htmlFor="otp">OTP</label>
         <input type="text" name="otp" placeholder="Enter Your OTP" value={formData.otp} onChange={handleInputChange} required />
         <input type="submit" onClick={handleSignup} value="Submit" />
         </form>}
         
      </form>
    </div>
  </div>
  )
}

export default Signup