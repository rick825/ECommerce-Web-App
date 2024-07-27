import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useLoginStatus } from '../../../context/LoginContext';

const EditProfile = ({setShowEditForm}) => {
  
    const {loggedInUser,setLoggedInUser} = useLoginStatus();
    const [formData, setFormData] = useState({
        fname: loggedInUser.fname,
        lname: loggedInUser.lname,
        email: loggedInUser.email,
        mobilenumber: loggedInUser.mobilenumber,
      });
    const [base64Image, setBase64Image] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setBase64Image(reader.result); 
          };
          reader.onerror = (error) => {
            console.log("Error: ", error);
          };
          reader.readAsDataURL(file);
        }
    
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          const response = await axios.post('/api/updateProfile', {
            ...formData,
            image: base64Image,
            id: loggedInUser._id
          });
    
          if (response.status === 200) {
            toast.success('Profile updated successfully!');
            setLoggedInUser(response.data.user);
            setShowEditForm(false);
          } else {
            toast.error('Failed to update profile');
          }
        } catch (error) {
          console.log('Error while submitting:', error);
          toast.error('Error while submitting');
        }
      };

    const handleForm = (value) =>{
       setShowEditForm(value)
    }

  return (
    <div className="editProfile">
         <div className="formClass">
         <form className="form" onSubmit={handleSubmit}>
               <div className="formHead">
                 <h2>Edit Your Data:</h2>
                 <h3 onClick={()=>handleForm(false)}>X</h3>
               </div>
               <div className="form-group">
                 <label htmlFor="fname">First Name:</label>
                 <input
                   type="text"
                   className="form-control"
                   id="name"
                   name="fname"
                   placeholder="Enter Your First Name"
                   value={formData.fname}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="lname">Last Name:</label>
                 <input
                   type="text"
                   className="form-control"
                   id="name"
                   name="lname"
                   placeholder="Enter Your Last Name"
                   value={formData.lname}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="email">Email:</label>
                 <input
                   type="email"
                   className="form-control"
                   id="email"
                   name="email"
                   placeholder="Enter Your Email"
                   value={formData.email}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
                   <label htmlFor="mobilenumber">Mobile Number:</label>
                   <input
                   type="text"
                   className="form-control"
                   id="mobilenumber"
                   name="mobilenumber"
                   placeholder="Enter Your Mobile Number"
                   value={formData.mobilenumber}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
            <label htmlFor="image">Select Profile Image:</label>
            <input
              type="file"
              className="form-control"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
               <button>Submit</button>
             </form>
           </div>
    </div>
  )
}

export default EditProfile