import React from 'react'
import './User.css'
import { useAdminContext } from '../../../../context/AdminContext'

const User = () => {
 
    const {seeUser} = useAdminContext();
    

  return (
    <div className='user'>
     <div className="usertop userdiv">
       <div className="usertopleft usertopcont">
         <div className="userimg">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
         </div>
         <div className="username">
            <h1>{seeUser.fname} {seeUser.lname}</h1>
         </div>
       </div>
       <div className="usertopmid usertopcont">
         <div className="userhead">
            <h2>Personal Info:</h2>
         </div>
         <div className="userinfo">
            <div className="uinfo">
                <h2>Email:</h2>
                <p>{seeUser.email}</p>
            </div>
            <div className="uinfo">
                <h2>Mobile Number:</h2>
                <p>{seeUser.mobilenumber}</p>
            </div>
            <div className="uinfo">
                <h2>Total Orders:</h2>
                <p>{seeUser.orders.length > 0 ? seeUser.orders.length : 0}</p>
            </div>
         </div>
       </div>
       <div className="usertopright usertopcont">
         <div className="userhead">
            <h2>Address:</h2>
         </div>
         <div className="addressinfo">
            {/* address */}
             {seeUser.addresses.length > 0 ? (
                seeUser.addresses.map((add)=>(
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
                <div className="order">
                    <div className="orderimg">
                      <img src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                    </div>
                    <div className="orderinfo">
                        <h3>Order Name</h3>
                        <p>Order Quantity: 2</p>
                        <p>Order Price: 200.00</p>
                        <p>Order Date: 12/12/2018</p>
                    </div>
                    <div className="orderadd">
                        <h3>Address Name</h3>
                        <p>1234, Main Street, New York, NY 10001</p>
                        <p>United States</p>
                        <p>Pin: 800000</p>
                    </div>
                </div>
                {/* end order */}
            </div>
        </div>
        <div className="userbotright">

        </div>
     </div>
    </div>
  )
}

export default User