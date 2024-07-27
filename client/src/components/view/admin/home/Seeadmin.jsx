import React,{useEffect,useState} from 'react'
import { useAdminContext } from '../../../../context/AdminContext';
import Navigation from '../navigation/Navigation';
import CreateAdmin from './CreateAdmin';
import { toast } from 'react-toastify';
import axios from 'axios';
import Editadmin from './Editadmin';

const Seeadmin = () => {
  
   const {adminData,adminList, setAdminList } = useAdminContext();
   const [adminForm, setAdminForm] = useState(false);
   const [editForm, setEditForm] = useState(false);
   const [editAdmin,setEditAdmin] = useState('');

   //handle edit button
   const handleEditButton = (value) =>{
    setEditForm(true);
    setEditAdmin(value);
   }

    // get admin
    const handleGetAdmin = async () => {
        try {
          const response = await axios.get('/getadmins');
          console.log("Running----");
          if (response.status === 200) {
            console.log(response.data.admins);
            setAdminList(response.data.admins);
          } else {
            toast.error('Something went wrong');
          }
        } catch (error) {
          console.log("Error while getting Admins-->", error);
          toast.error('Something went wrong');
        }
      };
    
      useEffect(() => {
        handleGetAdmin();
      }, []);

  //handle create admin    
  const handleCreateAdmin = () => {
    console.log("adminData-->",adminData.admin.role);
    if(adminData.admin.role === 'all'){
        setAdminForm(true);
    }else{
        toast.warning("Your are not allowed for this function!!");
    }
  }

  //handle delete admin
  const handleDeleteButton = async (adm) =>{
    try {
        console.log("delete admin-->",adm);

        const storedData = localStorage.getItem('admin');
        const {token} = storedData ? JSON.parse(storedData): {};

        if (!token) {
            console.error('No token found, please log in first');
            toast.error("No token found, please log in first");
            return;
         }

        if(adminData.admin.role === 'all'){
          const response = await axios.post('/api/deleteAdmin',{adm},{
            headers:{
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            }
          })
    
          if(response.status === 200){
            toast.success("Admin deleted successfully!!");
            setAdminList((prevList) => prevList.filter((prev) => prev.id !== adm.id))
          }else{
            toast.error("Something went wrong!!");
          }
        }else{
            toast.warning("Your are not allowed for this function!!");
        }
    } catch (error) {
        console.log("Error while Deleting Client",error);
        toast.error("Something went wrong!!");
    }
  }

  return (
    <div className='seeadmin admin'>
         {editForm && <Editadmin setEditForm={setEditForm} editAdmin = {editAdmin}/>}
         {adminForm && <CreateAdmin setAdminForm={setAdminForm} />}
         <div className="add-btn-div">
         <button className="add-btn" onClick={handleCreateAdmin}>Create Admin</button>
        <Navigation />
      </div>
      <div className="main-table">
          <table>
            <thead>
              <tr>
                <th>Unique ID</th>
                <th>Category Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminList && adminList.length > 0 ? (
                adminList.map((adm) => (
                  <tr key={adm.id}>
                    <td>{adm.id}</td>
                    <td>{adm.name}</td>
                    <td>{adm.role}</td>
                    <td className='tableBtnMain'>
                      <button className='tableBtn' onClick={()=>handleEditButton(adm)}>Edit</button>
                     {adm.role === 'all' ? ' ': <button className='tableBtn' onClick={()=>handleDeleteButton(adm)}>Delete</button>} 
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
  )
}

export default Seeadmin