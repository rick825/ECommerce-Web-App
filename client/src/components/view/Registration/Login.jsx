import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoginStatus } from '../../../context/LoginContext';



const Login = ({setLoggedIn}) => {
  
    const navigate = useNavigate(); 
    const [otpInput,setOtpInput] = useState(false);
    const [otp, setOtp] = useState();
    const {loggedInUser, setLoggedInUser} = useLoginStatus();
    
    const [formData, setFormData] = useState({
      email: "", password: ""
    });


    const handleInputChange = (e) =>{
      const {name, value} = e.target;
      console.log("Login Form Data:",formData);
      setFormData({
        ...formData,
        [name]:value
      })
  }

  //send otp
  const handleSendOtp = async (e) =>{
    e.preventDefault();
    try {

        const response = await axios.post('/api/verifyuser',{value: formData.email},{
          headers:{
            'Content-Type': 'application/json'
          }
        })

        if(response.status === 200){
          toast.success("Sending OTP!!")

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

        }else{
          navigate('/signup');
          toast.success("User not Exist! Kindly Signup!");
        
      }

    } catch (error) {
      console.log("Error:",error);
      toast.error("Internal Server Error");
    }
  }


  //handle Login
    const handleLogin = async (e) => {
      e.preventDefault();
      try {

        if(formData.otp === otp){
          console.log("Login Form Data:", formData);
          const response = await axios.post('/api/login', formData, {
              headers: {
                  "Content-Type": "application/json"
              }
          });
          if (response.status === 200) {
              console.log(response.data);
              setLoggedIn(true);
              console.log();
              setLoggedInUser(response.data.user);
              console.log("Response --->",loggedInUser);
              navigate('/home');
              toast.success("Login Successfully!!");
              toast.success(`Welcome ${response.data.user.fname}`);
          } else {
              console.error('Login failed');
          }
        }else{
          toast.error("OTP Mismatched!");
        }
      } catch (error) {
          console.log("Error While Login:-->", error);
          toast.error("Error while Login");
          navigate('/signup');
      }
  }
  

  const Signup = () =>{
        console.log("Signup");
        navigate('/signup');
    } 

  return (
    <div class="loginsec">
          
    <div class="leftlogin logs">
      <div class="llup">
        <h1><span>W</span>elcome,</h1>
        <h2>Kindly <span>Login!!</span></h2>
      </div>
       <div class="lldown">
         <div class="lldown-box">
          <div class="ecchart ecm">
            <div class="ecc1 ecc">

            </div>
            <div class="ecc2 ecc">

            </div>
            <div class="ecc3 ecc">

            </div>
            <div class="ecc4 ecc">

            </div>
            <div class="ecc5 ecc">

            </div>
            <div class="ecc6 ecc">

            </div>
            <div class="ecc7 ecc">

            </div>
            <div class="ecc8 ecc">

            </div>
            <div class="ecc2 ecc">

            </div>
          </div>
         </div>
       </div>
    </div>
    <div class="rightlogin logs">
      <form onSubmit={handleSendOtp} method="post" class="form">
         <label for="email">Email</label>
         <input type="text" name="email" placeholder="Enter Your Email ID" value={formData.email} onChange={handleInputChange} required/>
         <div class="alsign">
          <p>Not a User Please <a href className='regisbutton' onClick={Signup}>Sign Up</a></p>
         </div>
         { !otpInput && <input type="submit" value="Submit" />}
         {otpInput && <form className="otp form">
         <label htmlFor="otp">OTP</label>
         <input type="text" name="otp" placeholder="Enter Your OTP" value={formData.otp} onChange={handleInputChange} required />
         <input type="submit" onClick={handleLogin} value="Submit" />
         </form>}
      </form>
    </div>
  </div>
  )
}

export default Login