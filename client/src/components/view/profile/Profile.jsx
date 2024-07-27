import React,{useEffect, useState} from 'react'
import { useLoginStatus } from '../../../context/LoginContext';
import './Profile.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLocalProvider } from '../../../context/LocalContext';
import EditProfile from './EditProfile';
import AddAddress from './AddAddress';

const Profile = () => {

    const {loggedInUser} = useLoginStatus();
    const {setOrderList, orderList} = useLocalProvider();
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);

    console.log("LoggedInUser",loggedInUser);

    useEffect(() => {
     getOrders();
    }, []);


    const getOrders = async () => {
        try {
          const id = loggedInUser._id;
          const response = await axios.get(`/getUsersOrders/${id}`);
          
          if (response.status === 200) {
            console.log("Orders", response.data);    
            setOrderList(response.data);
          } else {
            toast.error("Error fetching orders");
          }
        } catch (error) {
          console.log("Error while Getting Orders-->", error);
          toast.error("Error while Getting Orders");
        }
      };

  return (
    <div className="profile home">
     <div className="usertop userdiv">
        {showEditForm && <EditProfile setShowEditForm={setShowEditForm}/>}
        {showAddressForm && <AddAddress setShowAddressForm={setShowAddressForm}/>}
       <div className="usertopleft usertopcont">
         <div className="userimg">
            <img src={loggedInUser.image} alt="" />
         </div>
         <div className="username">
            <h1>{loggedInUser.fname} {loggedInUser.lname}</h1>
         </div>
         <div className="userbtn">
            <button className="btn btn-primary" onClick={()=>setShowEditForm(true)}>Edit Profile</button>
            <button className='btn btn-primary' onClick={()=>setShowAddressForm(true)}>Add Address</button>
         </div>
       </div>
       <div className="usertopmid usertopcont">
         <div className="userhead">
            <h2>Personal Info:</h2>
         </div>
         <div className="userinfo">
            <div className="uinfo">
                <h2>Email:</h2>
                <p>{loggedInUser.email}</p>
            </div>
            <div className="uinfo">
                <h2>Mobile Number:</h2>
                <p>{loggedInUser.mobilenumber}</p>
            </div>
            <div className="uinfo">
                <h2>Total Orders:</h2>
                <p>{loggedInUser.orders.length > 0 ? loggedInUser.orders.length : 0}</p>
            </div>
         </div>
       </div>
       <div className="usertopright usertopcont">
         <div className="userhead">
            <h2>Address:</h2>
         </div>
         <div className="addressinfo">
            {/* address */}
             {loggedInUser.addresses.length > 0 ? (
                loggedInUser.addresses.map((add)=>(
                    <div className="address">
                    <h3>Address Name</h3>
                    <p>{add.street}, {add.city}, {add.state} </p>
                    <p>{add.country}</p>
                    <p>Pin: {add.postalCode}</p>
                 </div>
                ))) : 'No Address Found' }
             {/* end address */}
         </div>
       </div>
     </div>
     <div className="userbot userdiv">
        <div className="userbotleft">
            <div className="userhead">
                <h2>Orders:</h2>
            </div>
            <div className="orders">
                {/* order */}
                {orderList.length > 0 ? (
                  orderList.map((order) => (
                   order.products.map((item) => (
                <div key={item.product.id}>
                     <div className="order-item">
                      <div className="orderimg">
                        <img src={item.product.images[0] || "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}  alt={item.product.productName} />
                    </div>
                   <div className="orderinfo">
                     <h3>{item.product.productName}</h3>
                     <p>Quantity: {item.quantity}</p>
                     <p>Order Price: {item.product.price * item.quantity}</p>
                     <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                     <div className="ordercommon">
                     <p>Order Id: {order._id}</p>
                     <p>Order Total Quantity: {order.totalQuantity}</p>
                     <p>Order Total Price: {order.totalprice}</p>
                     </div>
                   </div>
                  <div className="orderadd">
                    <h3>Address Name</h3>
                     <p>1234, Main Street, New York, NY 10001</p>
                     <p>United States</p>
                    <p>Pin: 800000</p>
                    </div>
                 </div>
              </div>
             ))
           ))
         ) : "No Orders Available"}
                {/* end order */}
            </div>
        </div>
        <div className="userbotright">

        </div>
     </div>
    </div>
  )
}

export default Profile
