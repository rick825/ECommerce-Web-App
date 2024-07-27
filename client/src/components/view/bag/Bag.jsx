import React, { useEffect, useState } from 'react';
import './Bag.css';
import { useLocalProvider } from '../../../context/LocalContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLoginStatus } from '../../../context/LoginContext';


const Bag = () => {
  const { bag, setBag, wishlist, setWishList } = useLocalProvider();
  const [bagTotal, setBagTotal] = useState(0);
  const [quantities, setQuantities] = useState({});
  const {loggedInUser,setLoggedInUser} = useLoginStatus();
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const initialQuantities = {};
    bag.forEach(item => {
      initialQuantities[item.id] = 1; 
    });
    setQuantities(initialQuantities);
  }, [bag]);

  const baglength = bag.length;

  const removeFromBag = (prod) => {
    setBag((prevBag) => prevBag.filter((value) => value.id !== prod.id));
    toast.success(`${prod.productName} Removed from Bag`);
  }

  const moveToWishlist = (prod) => {
    if (!wishlist.some(wishItem => wishItem.id === prod.id)) {
      setWishList((prevWishList) => [...prevWishList, prod]);
      toast.success(`${prod.productName} Added to wishlist`);
      removeFromBag(prod);
    } else {
      toast.warning(`${prod.productName} is already in the wishlist`);
    }
  }

  const handleQuantityChange = (e, prod) => {
    const newQty = parseInt(e.target.value);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [prod.id]: newQty
    }));
  }

  useEffect(() => {
    console.log("Running");
    bagTot();
  }, [bag, quantities]);

  const bagTot = () => {
    let total = 0;
    bag.forEach(item => {
      total += item.price * (quantities[item.id] || 1);
    });
    console.log("Total-->",total);
    setBagTotal(total);
  }

  const handleProceedToBuy = async () => {
    try {
      const products = bag.map(item => ({
        product: {
            id: item.id,
            productName: item.productName,
            description: item.description,
            price: item.price,
            category: item.category,
            availability: item.availability,
            brand: item.brand,
            images: item.images
        },
        quantity: quantities[item.id] || 1
    }));

      const userid = loggedInUser._id;
       
      console.log("Selected Addresss",selectedAddress);

      if(bag.length  === 0){
        toast.warning("Your bag is empty");
      }else{
        const response = await axios.post('/api/postOrders', { products,userid,address: selectedAddress }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (response.status === 201) {
          toast.success('Order placed successfully!');
          setBag([]); 
          setLoggedInUser(response.data.user);
        } else {
          toast.error('Failed to place order');
        }
      }

    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error placing order');
    }
  }

  return (
    <div className='bag home'>
      <div className="bagleft bagcont">
        <div className="bagtop">
          <h2>Bag Item : {bag.length}</h2>
        </div>
        <div className="baglist">
          {baglength === 0 && (
            <div>
              <h2><center>No Items Available in Bag</center></h2>
            </div>
          )}
          {bag.map((item) => (
            <div key={item.productName} className="bagitem bagitem1">
              <div className="bagitemleft">
                <div className="bagitemimg">
                  {item.images.length > 0 ? (<img src={item.images[0]} alt='' />):( <img src="https://images.unsplash.com/photo-1555529669-2269763671c0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />)}
                </div>
              </div>
              <div className="bagitemright">
                <div className="bagiteminfo">
                  <h2>{item.productName}</h2>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates dolorum tenetur iste architecto totam molestias et illum! Accusantium saepe dicta debitis unde quibusdam vel numquam aliquid illo exercitationem asperiores? Tempora!</p>
                  <div className="bagitembutton">
                    <button className='removeFromCart btn' onClick={() => removeFromBag(item)}>Remove <span>From Bag   →</span></button>
                    <button className='moveToWishlist btn' onClick={() => moveToWishlist(item)}>Move <span>To Wishlist   →</span></button>
                  </div>
                </div>
                <div className="bagitemqty">
                  <h2>QTY</h2>
                  <div className="bagqtyinput">
                    <select name="qty" id="qty" value={quantities[item.productName]} onChange={(e) => handleQuantityChange(e, item)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>
                <div className="bagitemprice">
                  <h2>Total</h2>
                  <h3>₹{item.price * (quantities[item.productName] || 1)}.00</h3>
                  <p>(Inc. Tax)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bagright bagcont">
        <div className="bagtotal">
          <div className="bagtotalhead">
            <h2>Bag Total</h2>
          </div>
          <div className="bagtotalbot">
            <div className="bagtotalitem bagtotalitemhead">
              <div className="itemname">
                <h2>Item</h2>
              </div>
              <div className="itemqtyy">
                <h2>Quantity</h2>
              </div>
              <div className="itemprice">
                <h2>Price</h2>
              </div>
            </div>
            {baglength === 0 && <p>No Items Available</p>}
            {bag.map((item) => (
              <div key={item.productName} className="bagtotalitem">
                <div className="itemname">
                  <h2>{item.productName}</h2>
                </div>
                <div className="itemqty">
                  <h2>{quantities[item.id]}</h2>
                </div>
                <div className="itemprice">
                  <h3>₹ {item.price * (quantities[item.id] || 1)}.00</h3>
                </div>
              </div>
            ))}
            <div className="bagtotalitem bagtotalmain">
              <div className="itemname">
                <h2>Total :</h2>
              </div>
              <div className="itemprice">
                <h3>₹ {bagTotal}.00</h3>
                <p>(Inc. Tax)</p>
              </div>
            </div>
          </div>
          <div className="selectaddress">
          <h2>Select Address:</h2>
            {loggedInUser.addresses && loggedInUser.addresses.length > 0 ? (
              <div className="addressList">
                {loggedInUser.addresses.map(address => (
                  <div key={address.id} className="addressItem">
                    <input
                      type="radio"
                      id={`address-${address.id}`}
                      name="selectedAddress"
                      value={address.id}
                      checked={selectedAddress === address.id}
                      onChange={() => setSelectedAddress(address.id)}
                    />
                    <label htmlFor={`address-${address.id}`}>
                      <h4>{address.name}</h4>
                      <p>{address.street}, {address.city} </p>
                      <p>{address.state}</p>
                      <p>{address.country}</p>
                      <p>Pin - {address.postalCode} </p>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p>No saved addresses. Please add an address to proceed.</p>
            )}
          </div>
          <div className="bagtotalbtn">
            <button onClick={handleProceedToBuy}>Proceed To Buy</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bag;
