import React, { useEffect, useState } from 'react';
import './SeeCategories.css';
import Navigation from '../navigation/Navigation';
import { useAdminContext } from '../../../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import EditForm from './EditForm';
import CreateCategory from './CreateCategory';

const SeeCategories = () => {

  const { categories,setCategories,adminData } = useAdminContext();
  const [showForm, setShowForm] = useState(false)
  const [showEditForm,setShowEditForm] = useState(false);
  const [refresh,setRefresh] = useState('');

  //handleform
  const handleForm = (value) =>{
    setShowForm(value);
  }

  //get categories
  useEffect(()=>{
    handleGetCategories();
  },[refresh,setRefresh]);

  const handleGetCategories = async () =>{
    try {
      const response = await axios.get('/getcategories');
      if(response.status === 200){
         setCategories(response.data.categories);
         setRefresh('');
      }
      
    } catch (error) {
      console.log("Error while getting Categories",error);
      toast.error("Error while Getting Categories");
    }
  }


  // delete Category
  const handleDeleteCategory = async (cate) =>{
    try {
      if(adminData.admin.role === 'all' || adminData.admin.role === 'write'){

        const token  = adminData.token ? adminData.token : {};
        console.log("Token-->",token);
        if (!token) {
          console.error('No token found, please log in first');
          toast.error("No token found, please log in first");
          return;
       }
        const response = await axios.post('/api/deleteCategory',{cate},{
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        })

        if(response.status===200){
          toast.success("Category Deleted Successfully!!");
          handleGetCategories();
        }

      }else{
        toast.error("You don't have permission to delete categories");
      }
      
    } catch (error) {
       console.log("Error while Deleting Category-->",error);
       toast.error("Error while Deleting Category");
    }
  }

  

  return (
    <div className='seeCategory'>
      <div className="seeCategoryTop add-btn-div">
        <button className="add-btn" onClick={()=>handleForm(true)}>Add Category</button>
        <Navigation />
      </div>
      <div className="seeCategoryBottom">
      {showForm && <CreateCategory showForm={showForm} setShowForm={setShowForm} setRefresh={setRefresh}/>}
      {showEditForm && <EditForm showEditForm={showEditForm} setShowEditForm={setShowEditForm}  setRefresh={setRefresh} />}
        <div className="main-table">
          <table>
            <thead>
              <tr>
                <th>Unique ID</th>
                <th>Category Name</th>
                <th>Total Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories && categories.length > 0 ? (
                categories.map((cate) => (
                  <tr key={cate.id}>
                    <td>{cate.id}</td>
                    <td>{cate.name}</td>
                    <td>{cate.products.length > 0 ? cate.products.length : 0}</td>
                    <td className='tableBtnMain'>
                      <button className='tableBtn'>See Products</button>
                      <button className='tableBtn' onClick={()=>setShowEditForm(cate)}>Edit</button>
                      <button className='tableBtn' onClick={()=>handleDeleteCategory(cate)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SeeCategories;
