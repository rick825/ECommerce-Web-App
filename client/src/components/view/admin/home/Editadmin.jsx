import React,{useState} from 'react'
import { useAdminContext } from '../../../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Editadmin = ({setEditForm, editAdmin}) => {
    const {setAdminList} = useAdminContext(); 
    const [formData, setFormData] = useState({
       name: editAdmin.name,
       email: editAdmin.email,
       role: editAdmin.role
     });
    
   
     const handleForm = (value)=>{
       setEditForm(value)
     }
   
     const handleChange = (e)=>{
       const {name,value} = e.target;
       setFormData({...formData,[name]:value})
     }
   
     const handleSubmit = async (e) =>{
       try {
           e.preventDefault();
           console.log(formData);
           const storedData = localStorage.getItem('admin');
           const { token } = storedData ? JSON.parse(storedData) : {};
   
         if (!token) {
           console.error('No token found, please log in first');
           toast.error("No token found, please log in first");
           return;
        }

        const uid = editAdmin.id;
           const response = await axios.post('/api/updateAdmin',{uid,...formData},{
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
                   }
           })
           if(response.status === 200){
               toast.success('Admin Updated Successfully Successful');
               const updatedAdmin = response.data.admin;

              setAdminList((prevData) => 
              prevData.map((admin) => 
              admin.id === updatedAdmin.id ? updatedAdmin : admin
              )
             );
               handleForm(false);
           }
           
       } catch (error) {
           console.error("Error While Creating Admin", error);
           if (error.response && error.response.data && error.response.data.message) {
             toast.warning(`Error: ${error.response.data.message}`);
           } else {
             toast.error("Error While Updating Admin");
           }
         }
     }
   
     return (
       <div className='createAdmin'>
         <div className="formClass">
         <form className="form" onSubmit={handleSubmit}>
               <div className="formHead">
                 <h2>Enter Admin Data:</h2>
                 <h3 onClick={()=>handleForm(false)}>X</h3>
               </div>
               <div className="form-group">
                 <label htmlFor="name">Admin Name:</label>
                 <input
                   type="text"
                   className="form-control"
                   id="name"
                   name="name"
                   placeholder="Enter Admin Name"
                   value={formData.name}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="email">Admin Email:</label>
                 <input
                   type="email"
                   className="form-control"
                   id="email"
                   name="email"
                   placeholder="Enter Admin Email"
                   value={formData.email}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
                   <label htmlFor="role">Admin Role:</label>
                   <select
                   className="form-control"
                   id="role"
                   name="role"
                   value={formData.role}
                   onChange={handleChange}
                   required
                   >
                       <option value="all">All</option>
                       <option value="read">Read</option>
                       <option value="edit">Edit</option>
                   </select>
               </div>
               <button>Submit</button>
             </form>
           </div>
       </div>
     )
}

export default Editadmin