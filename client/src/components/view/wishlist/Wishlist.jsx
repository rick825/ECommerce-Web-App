import React from 'react'
import { useLocalProvider } from '../../../context/LocalContext'
import { toast } from 'react-toastify';

const Wishlist = () => {
  
  const { wishlist, setWishList, setBag, bag } = useLocalProvider();

  const wishlength = wishlist.length;

  const removeFromWishlist = (prod) =>{
    setWishList((prevWishlist)=>prevWishlist.filter((item)=>item.productName !== prod.productName));
    toast.success(
      `${prod.productName} removed from wishlist`
    );
  }

  const moveToBag = (prod)=>{
    if(!bag.some(bagitem => bagitem.productName === prod.productName)){
      setBag((prevBag)=>[...prevBag, prod]);
      toast.success(
        `${prod.productName} added to bag`
      )
      removeFromWishlist(prod);
    }else{
      toast.warning(
        `${prod.productName} already in bag`
      )
    }
  }


  return (
    <div className='bag wishlist home'>
    <div className="bagleft wishlistleft bagcont">
      <div className="bagtop">
        <h2>Wishlist Item : {wishlist.length}</h2>
      </div>
      <div className="baglist">
        {/* bagitem */}
        {wishlength === 0 && (<div>
          <h2><center>No Items Available in Wishlist</center></h2>
        </div>)}
        {wishlist.map((item) => (
        <div className="bagitem bagitem1">
          <div className="bagitemleft">
            <div className="bagitemimg">
            <img src="https://images.unsplash.com/photo-1555529669-2269763671c0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            </div>
          </div>
          <div className="bagitemright">
            <div className="bagiteminfo">
              <h2>{item.productName}</h2>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates dolorum tenetur iste architecto totam molestias et illum! Accusantium saepe dicta debitis unde quibusdam vel numquam aliquid illo exercitationem asperiores? Tempora!</p>
              <div className="bagitembutton">
                <button className='removeFromCart btn' onClick={()=>removeFromWishlist(item)}>Remove <span>From Wishlist  →</span></button>
                <button className='moveToWishlist btn' onClick={()=>moveToBag(item)}>Move <span>To Bag   →</span></button>
              </div>
            </div>
            <div className="bagitemqty">
              <h2>QTY</h2>
              <div className="bagqtyinput">
               <select name="qty" id="qty">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
               </select>
              </div>
            </div>
            <div className="bagitemprice">
              <h2>Total</h2>
              <h3>₹{item.price}.00</h3>
              <p>(Inc. Tax)</p>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default Wishlist