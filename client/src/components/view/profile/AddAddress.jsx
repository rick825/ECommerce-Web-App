import axios from 'axios';
import React,{useState} from 'react'
import { toast } from 'react-toastify';
import { useLoginStatus } from '../../../context/LoginContext';

const AddAddress = ({setShowAddressForm}) => {

    const [formData, setFormData] = useState({
        name:'',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });

    const {loggedInUser, setLoggedInUser} = useLoginStatus();

      const handleChange = (e)=>{
        const {name,value} = e.target;
        setFormData(
        {...formData,
            [name]:value
        })
      }

      const handleForm = (value) =>{
        setShowAddressForm(value);
      }

      const handleUniqueId = () =>{
        const uniqueId = Math.floor(Math.random() * 100).toString().padStart(3, '0');
        return uniqueId;
      }

      const handleSubmit = async  (e) =>{
          try {
            e.preventDefault();

            const id = handleUniqueId();
            const userid = loggedInUser._id

            const response = await axios.post('/api/addAddress',{...formData,userid,id},{
                headers:{
                    'Content-Type': 'application/json',
                }
            })

            if(response.status === 200){
                setLoggedInUser(response.data.user);
                toast.success('Address Added Successfully');
                setShowAddressForm(false);
            }
            
          } catch (error) {
            console.log("Error while adding address-->",error);
            toast.error("Error while adding address");
          }
      }


  return (
    <div className="addaddress">
         <div className="formClass">
         <form className="form" onSubmit={handleSubmit}>
               <div className="formHead">
                 <h2>Add Address:</h2>
                 <h3 onClick={()=>handleForm(false)}>X</h3>
               </div>
               <div className="form-group">
                 <label htmlFor="name">Address Name:</label>
                 <input
                   type="text"
                   className="form-control"
                   id="name"
                   name="name"
                   placeholder="Enter Name"
                   value={formData.name}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="street">Street:</label>
                 <input
                   type="text"
                   className="form-control"
                   id="street"
                   name="street"
                   placeholder="Enter Street"
                   value={formData.street}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="city">City:</label>
                 <input
                   type="text"
                   className="form-control"
                   id="city"
                   name="city"
                   placeholder="Enter Your City"
                   value={formData.city}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="state">State:</label>
                 <input
                   type="text"
                   className="form-control"
                   id="state"
                   name="state"
                   placeholder="Enter Your State"
                   value={formData.state}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="postalCode">Postal Code:</label>
                 <input
                   type="Number"
                   className="form-control"
                   id="postalCode"
                   name="postalCode"
                   placeholder="Enter Your postalCode"
                   value={formData.postalCode}
                   onChange={handleChange}
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="country">Country:</label>
                 <input
                   type="text"
                   className="form-control"
                   id="country"
                   name="country"
                   placeholder="Enter Your country"
                   value={formData.country}
                   onChange={handleChange}
                   required
                 />
               </div>
               <button>Submit</button>
             </form>
           </div>
    </div>
  )
}

export default AddAddress