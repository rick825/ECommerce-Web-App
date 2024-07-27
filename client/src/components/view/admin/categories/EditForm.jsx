import React, { useState } from 'react';
import { useAdminContext } from '../../../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditForm = ({showEditForm,setShowEditForm, setRefresh}) => {

    const {adminData} = useAdminContext();
    const [formData,setFormData] = useState({
        name: showEditForm.name,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };

    //submit new categories
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if(adminData.admin.role === 'all' || adminData.admin.role === 'write'){
    
         
          console.log("Admin--->",adminData.token);
         const token  = adminData.token ? adminData.token : {};
         const cate = showEditForm;
    
          const response = await axios.post('/api/updateCategory',{cate,formData} , {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          if (response.status === 200) {
            toast.success('Category Updated Successfully');
            setFormData({ name: '' });
            setShowEditForm(false);
            setRefresh('edited');
          }
        }else{
          toast.warning("You are not authorized to create category")
         }
        } catch (error) {
          console.log("Error while Creating Category -->", error);
          toast.error("Error while Creating Category");
        }
      };

  return (
    <div className="formClass">
    <form className="form" onSubmit={handleSubmit}>
      <div className="formHead">
        <h2>Edit Category:</h2>
        <h3 onClick={()=>setShowEditForm(false)}>X</h3>
      </div>
     <div className="form-group">
        <label htmlFor="name">Category Name:</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name='name'
          placeholder="Enter Category Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
  )
}

export default EditForm